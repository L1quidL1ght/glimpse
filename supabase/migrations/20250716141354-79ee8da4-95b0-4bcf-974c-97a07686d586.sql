-- Create edge function for secure staff user management
-- This will be used by the edge functions to manage staff users securely

-- Add RLS policy to allow service role to manage staff_users
CREATE POLICY "Service role can manage all staff_users" 
ON public.staff_users 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);