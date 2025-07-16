-- Update staff_users RLS policies to work with PIN-based authentication
-- Remove existing restrictive policies and add service role support

-- Drop existing policies that are too restrictive
DROP POLICY IF EXISTS "Only admins can insert staff_users" ON public.staff_users;
DROP POLICY IF EXISTS "Only admins can update staff_users" ON public.staff_users;
DROP POLICY IF EXISTS "Only admins can delete staff_users" ON public.staff_users;

-- Keep the service role policy for edge function access
-- The "Service role can manage all staff_users" policy already exists and should remain

-- Add a more flexible policy for authenticated staff with admin role
CREATE POLICY "Staff with admin role can manage staff_users"
ON public.staff_users
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.staff_users su
    WHERE su.pin_hash IS NOT NULL
    AND su.role = 'admin'
    AND su.is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.staff_users su
    WHERE su.pin_hash IS NOT NULL
    AND su.role = 'admin'
    AND su.is_active = true
  )
);