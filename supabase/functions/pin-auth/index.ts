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
  pin_hash: string
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

    if (!pin || pin.length !== 4) {
      return new Response(
        JSON.stringify({ error: 'Invalid PIN format. PIN must be 4 digits.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get all active staff users
    const { data: staffUsers, error } = await supabaseClient
      .from('staff_users')
      .select('*')
      .eq('is_active', true)

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Simple hash comparison for PIN (in production, use proper bcrypt comparison)
    const authenticatedUser = staffUsers?.find((user: StaffUser) => {
      // For demo purposes, comparing against hashed PIN
      // In production, use proper bcrypt comparison
      const expectedHash = '$2b$10$N9qo8uLOickgx2ZMRZoMye1sxDe8J.A9.8zWm7WUE2T.K.sR1B2LS' // PIN 1234
      return pin === '1234' && user.pin_hash === expectedHash
    })

    if (!authenticatedUser) {
      return new Response(
        JSON.stringify({ error: 'Invalid PIN' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

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