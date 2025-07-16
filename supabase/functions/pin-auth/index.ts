import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AuthRequest {
  pin: string
}

interface StaffUser {
  id: string
  name: string
  pin: string
  role: string
  is_active: boolean
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { pin }: AuthRequest = await req.json()

    // Validate PIN format (exactly 4 digits)
    if (!pin || !/^\d{4}$/.test(pin)) {
      return new Response(
        JSON.stringify({ error: 'PIN must be exactly 4 digits' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Authentication attempt with PIN: ${pin}`)

    // Find user with matching PIN
    const { data: authenticatedUser, error } = await supabaseClient
      .from('staff_users')
      .select('id, name, role, pin')
      .eq('pin', pin)
      .eq('is_active', true)
      .single()

    if (error || !authenticatedUser) {
      console.log('Authentication failed: Invalid PIN')
      return new Response(
        JSON.stringify({ error: 'Invalid PIN' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Authentication successful for user: ${authenticatedUser.name} (${authenticatedUser.role})`)

    // Generate session token (simple UUID for demo - in production use JWT)
    const sessionToken = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000) // 8 hours

    return new Response(
      JSON.stringify({ 
        success: true,
        user: {
          id: authenticatedUser.id,
          name: authenticatedUser.name,
          role: authenticatedUser.role
        },
        session: {
          token: sessionToken,
          expiresAt: expiresAt.toISOString()
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})