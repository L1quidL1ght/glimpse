import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Create service role client for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create regular client to verify user auth
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    // Verify user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('Authentication failed')
    }

    // Check if user is admin using the existing function
    const { data: role, error: roleError } = await supabase.rpc('get_current_user_role')
    if (roleError || role !== 'admin') {
      throw new Error('Insufficient permissions - admin required')
    }

    const { method } = req
    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    if (method === 'GET' && action === 'list') {
      // List all staff users
      const { data, error } = await supabaseAdmin
        .from('staff_users')
        .select('id, name, role, is_active, created_at, updated_at')
        .order('created_at', { ascending: false })

      if (error) throw error

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (method === 'POST' && action === 'create') {
      const { name, pin, role = 'staff' } = await req.json()

      if (!name || !pin) {
        throw new Error('Name and PIN are required')
      }

      if (pin.length < 4) {
        throw new Error('PIN must be at least 4 characters')
      }

      // Hash the PIN
      const pinHash = await bcrypt.hash(pin)

      const { data, error } = await supabaseAdmin
        .from('staff_users')
        .insert({
          name,
          pin_hash: pinHash,
          role,
          is_active: true
        })
        .select('id, name, role, is_active, created_at, updated_at')
        .single()

      if (error) throw error

      console.log(`Staff user created: ${name} (${role})`)

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (method === 'PUT' && action === 'update') {
      const { id, name, pin, role, is_active } = await req.json()

      if (!id) {
        throw new Error('User ID is required')
      }

      const updates: any = {}
      if (name !== undefined) updates.name = name
      if (role !== undefined) updates.role = role
      if (is_active !== undefined) updates.is_active = is_active
      
      // Only hash and update PIN if provided
      if (pin) {
        if (pin.length < 4) {
          throw new Error('PIN must be at least 4 characters')
        }
        updates.pin_hash = await bcrypt.hash(pin)
      }

      const { data, error } = await supabaseAdmin
        .from('staff_users')
        .update(updates)
        .eq('id', id)
        .select('id, name, role, is_active, created_at, updated_at')
        .single()

      if (error) throw error

      console.log(`Staff user updated: ${id}`)

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (method === 'DELETE' && action === 'delete') {
      const { id } = await req.json()

      if (!id) {
        throw new Error('User ID is required')
      }

      const { error } = await supabaseAdmin
        .from('staff_users')
        .delete()
        .eq('id', id)

      if (error) throw error

      console.log(`Staff user deleted: ${id}`)

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    throw new Error(`Unsupported method: ${method} with action: ${action}`)

  } catch (error) {
    console.error('Error in staff-management function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})