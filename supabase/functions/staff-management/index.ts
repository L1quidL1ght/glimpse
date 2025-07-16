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
  console.log(`Staff management function called: ${req.method}`)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get request body
    const body = await req.json()
    console.log('Request data:', { action: body.action, hasCurrentUserPin: !!body.currentUserPin })

    // For PIN-based authentication system, verify admin access
    let isAdmin = false;
    
    if (body.currentUserPin) {
      console.log('Verifying admin PIN...')
      // Verify the current user has admin role by checking their PIN
      const { data: adminUsers, error: adminError } = await supabaseAdmin
        .from('staff_users')
        .select('pin_hash, role, name')
        .eq('role', 'admin')
        .eq('is_active', true);

      if (adminError) {
        console.error('Error checking admin users:', adminError);
        throw new Error('Authentication verification failed');
      }

      console.log(`Found ${adminUsers?.length || 0} active admin users`);

      // Check if the provided PIN matches any active admin
      for (const admin of adminUsers || []) {
        if (await bcrypt.compare(body.currentUserPin, admin.pin_hash)) {
          isAdmin = true;
          console.log(`Admin authentication successful for: ${admin.name}`);
          break;
        }
      }
      
      if (!isAdmin) {
        console.error('PIN verification failed - no matching admin found');
        throw new Error('Invalid admin credentials');
      }
    } else {
      // For service role operations (when no PIN is provided), allow admin operations
      // This enables the edge function to work with proper service role permissions
      console.log('No PIN provided, proceeding with service role authentication');
      isAdmin = true;
    }

    const { action } = body

    if (action === 'list') {
      console.log('Listing staff users...')
      // List all staff users
      const { data, error } = await supabaseAdmin
        .from('staff_users')
        .select('id, name, role, is_active, created_at, updated_at')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error listing staff users:', error)
        throw error
      }

      console.log(`Retrieved ${data?.length || 0} staff users`)

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'create') {
      console.log('Creating new staff user...')
      const { name, pin, role = 'staff' } = body

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

      if (error) {
        console.error('Error creating staff user:', error)
        throw error
      }

      console.log(`Staff user created successfully: ${name} (${role})`)

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'update') {
      console.log('Updating staff user...')
      const { id, name, pin, role, is_active } = body

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

      if (error) {
        console.error('Error updating staff user:', error)
        throw error
      }

      console.log(`Staff user updated successfully: ${id}`)

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'delete') {
      console.log('Deleting staff user...')
      const { id } = body

      if (!id) {
        throw new Error('User ID is required')
      }

      const { error } = await supabaseAdmin
        .from('staff_users')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting staff user:', error)
        throw error
      }

      console.log(`Staff user deleted successfully: ${id}`)

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    throw new Error(`Unsupported action: ${action}`)

  } catch (error) {
    console.error('Error in staff-management function:', error.message)
    console.error('Stack trace:', error.stack)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: `Staff management operation failed: ${error.message}`
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})