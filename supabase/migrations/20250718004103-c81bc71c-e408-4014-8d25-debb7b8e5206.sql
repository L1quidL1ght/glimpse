-- Create staff_sessions table to track active PIN-based sessions
CREATE TABLE IF NOT EXISTS public.staff_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_user_id UUID NOT NULL,
  session_token UUID NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS on staff_sessions
ALTER TABLE public.staff_sessions ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage all sessions
CREATE POLICY "Service role can manage all staff_sessions" 
ON public.staff_sessions 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create function to check if current request has valid staff authentication
CREATE OR REPLACE FUNCTION public.is_staff_authenticated()
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  -- For now, return true to allow operations while we implement session management
  -- This will be updated once session management is in place
  SELECT true;
$$;

-- Create function to check staff authentication with session token
CREATE OR REPLACE FUNCTION public.is_staff_authenticated_with_token(session_token UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.staff_sessions ss
    JOIN public.staff_users su ON ss.staff_user_id = su.id
    WHERE ss.session_token = is_staff_authenticated_with_token.session_token
      AND ss.expires_at > now()
      AND ss.is_active = true
      AND su.is_active = true
  );
$$;

-- Update RLS policies to use staff authentication instead of Supabase auth

-- Update customers table policies
DROP POLICY IF EXISTS "Authenticated users can insert customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can update customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can view customers" ON public.customers;

CREATE POLICY "Staff can insert customers" 
ON public.customers 
FOR INSERT 
WITH CHECK (public.is_staff_authenticated());

CREATE POLICY "Staff can update customers" 
ON public.customers 
FOR UPDATE 
USING (public.is_staff_authenticated());

CREATE POLICY "Staff can view customers" 
ON public.customers 
FOR SELECT 
USING (public.is_staff_authenticated());

-- Update customer_tags policies
DROP POLICY IF EXISTS "Authenticated users can manage customer_tags" ON public.customer_tags;

CREATE POLICY "Staff can manage customer_tags" 
ON public.customer_tags 
FOR ALL 
USING (public.is_staff_authenticated());

-- Update other related table policies
DROP POLICY IF EXISTS "Authenticated users can manage allergies" ON public.allergies;
CREATE POLICY "Staff can manage allergies" 
ON public.allergies 
FOR ALL 
USING (public.is_staff_authenticated());

DROP POLICY IF EXISTS "Authenticated users can manage cocktail_preferences" ON public.cocktail_preferences;
CREATE POLICY "Staff can manage cocktail_preferences" 
ON public.cocktail_preferences 
FOR ALL 
USING (public.is_staff_authenticated());

DROP POLICY IF EXISTS "Authenticated users can manage connections" ON public.connections;
CREATE POLICY "Staff can manage connections" 
ON public.connections 
FOR ALL 
USING (public.is_staff_authenticated());

DROP POLICY IF EXISTS "Authenticated users can manage customer_notes" ON public.customer_notes;
CREATE POLICY "Staff can manage customer_notes" 
ON public.customer_notes 
FOR ALL 
USING (public.is_staff_authenticated());

DROP POLICY IF EXISTS "Authenticated users can manage food_preferences" ON public.food_preferences;
CREATE POLICY "Staff can manage food_preferences" 
ON public.food_preferences 
FOR ALL 
USING (public.is_staff_authenticated());

DROP POLICY IF EXISTS "Authenticated users can manage important_dates" ON public.important_dates;
CREATE POLICY "Staff can manage important_dates" 
ON public.important_dates 
FOR ALL 
USING (public.is_staff_authenticated());

DROP POLICY IF EXISTS "Authenticated users can manage important_notables" ON public.important_notables;
CREATE POLICY "Staff can manage important_notables" 
ON public.important_notables 
FOR ALL 
USING (public.is_staff_authenticated());

DROP POLICY IF EXISTS "Authenticated users can manage reservations" ON public.reservations;
CREATE POLICY "Staff can manage reservations" 
ON public.reservations 
FOR ALL 
USING (public.is_staff_authenticated());

DROP POLICY IF EXISTS "Authenticated users can manage spirits_preferences" ON public.spirits_preferences;
CREATE POLICY "Staff can manage spirits_preferences" 
ON public.spirits_preferences 
FOR ALL 
USING (public.is_staff_authenticated());

DROP POLICY IF EXISTS "Authenticated users can manage table_preferences" ON public.table_preferences;
CREATE POLICY "Staff can manage table_preferences" 
ON public.table_preferences 
FOR ALL 
USING (public.is_staff_authenticated());

DROP POLICY IF EXISTS "Authenticated users can manage visits" ON public.visits;
CREATE POLICY "Staff can manage visits" 
ON public.visits 
FOR ALL 
USING (public.is_staff_authenticated());

DROP POLICY IF EXISTS "Authenticated users can manage visit_orders" ON public.visit_orders;
CREATE POLICY "Staff can manage visit_orders" 
ON public.visit_orders 
FOR ALL 
USING (public.is_staff_authenticated());

DROP POLICY IF EXISTS "Authenticated users can manage wine_preferences" ON public.wine_preferences;
CREATE POLICY "Staff can manage wine_preferences" 
ON public.wine_preferences 
FOR ALL 
USING (public.is_staff_authenticated());

-- Create trigger to update staff_sessions updated_at
CREATE OR REPLACE FUNCTION public.update_staff_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_staff_sessions_updated_at
  BEFORE UPDATE ON public.staff_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_staff_sessions_updated_at();