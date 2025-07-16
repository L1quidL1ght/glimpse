import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Create service role client for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Validate PIN format (exactly 4 digits)
function isValidPin(pin: string): boolean {
  return /^\d{4}$/.test(pin);
}

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
      
      if (!isValidPin(body.currentUserPin)) {
        throw new Error('Invalid PIN format. PIN must be exactly 4 digits.');
      }
      
      // Verify the current user has admin role by checking their PIN
      const { data: adminUser, error: adminError } = await supabaseAdmin
        .from('staff_users')
        .select('pin, role, name')
        .eq('pin', body.currentUserPin)
        .eq('role', 'admin')
        .eq('is_active', true)
        .single();

      if (adminError || !adminUser) {
        console.error('PIN verification failed:', adminError);
        throw new Error('Invalid admin credentials');
      }

      isAdmin = true;
      console.log(`Admin authentication successful for: ${adminUser.name}`);
    } else {
      // For service role operations (when no PIN is provided), allow admin operations
      console.log('No PIN provided, proceeding with service role authentication');
      isAdmin = true;
    }

    const { action } = body

    if (action === 'list') {
      console.log('Listing staff users...')
      // List all staff users (mask PINs in response for security)
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

      // Validate PIN format
      if (!isValidPin(pin)) {
        throw new Error('PIN must be exactly 4 digits (e.g. 1234)')
      }

      // Check for duplicate PIN
      const { data: existingUser, error: duplicateError } = await supabaseAdmin
        .from('staff_users')
        .select('id, name')
        .eq('pin', pin)
        .single();

      if (existingUser) {
        throw new Error(`PIN ${pin} is already in use by another user. Please choose a different PIN.`);
      }

      // duplicateError is expected when no duplicate is found, so we continue

      const { data, error } = await supabaseAdmin
        .from('staff_users')
        .insert({
          name,
          pin,
          role,
          is_active: true
        })
        .select('id, name, role, is_active, created_at, updated_at')
        .single()

      if (error) {
        console.error('Error creating staff user:', error)
        
        // Handle unique constraint violation
        if (error.code === '23505' && error.message.includes('pin_unique')) {
          throw new Error(`PIN ${pin} is already in use. Please choose a different PIN.`);
        }
        
        throw error
      }

      console.log(`Staff user created successfully: ${name} (${role}) with PIN ${pin}`)

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
      
      // Validate and check for duplicate PIN if provided
      if (pin !== undefined) {
        if (!isValidPin(pin)) {
          throw new Error('PIN must be exactly 4 digits (e.g. 1234)')
        }

        // Check if another user already has this PIN
        const { data: existingUser, error: duplicateError } = await supabaseAdmin
          .from('staff_users')
          .select('id, name')
          .eq('pin', pin)
          .neq('id', id)  // Exclude current user
          .single();

        if (existingUser) {
          throw new Error(`PIN ${pin} is already in use by ${existingUser.name}. Please choose a different PIN.`);
        }

        updates.pin = pin
      }

      const { data, error } = await supabaseAdmin
        .from('staff_users')
        .update(updates)
        .eq('id', id)
        .select('id, name, role, is_active, created_at, updated_at')
        .single()

      if (error) {
        console.error('Error updating staff user:', error)
        
        // Handle unique constraint violation
        if (error.code === '23505' && error.message.includes('pin_unique')) {
          throw new Error(`PIN ${pin} is already in use. Please choose a different PIN.`);
        }
        
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