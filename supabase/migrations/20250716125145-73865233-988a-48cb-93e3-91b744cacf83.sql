-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'manager', 'staff')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid() AND is_active = true;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create security definer function to check if user is authenticated
CREATE OR REPLACE FUNCTION public.is_authenticated_user()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_active = true
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Profiles policies - users can only see their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Admins can manage all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can insert profiles" 
ON public.profiles FOR INSERT 
WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can update profiles" 
ON public.profiles FOR UPDATE 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can delete profiles" 
ON public.profiles FOR DELETE 
USING (public.get_current_user_role() = 'admin');

-- Update existing table policies to require authentication
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Allow all operations on customers" ON public.customers;
DROP POLICY IF EXISTS "Allow all on customers" ON public.customers;

-- Create secure policies for customers table
CREATE POLICY "Authenticated users can view customers" 
ON public.customers FOR SELECT 
USING (public.is_authenticated_user());

CREATE POLICY "Authenticated users can insert customers" 
ON public.customers FOR INSERT 
WITH CHECK (public.is_authenticated_user());

CREATE POLICY "Authenticated users can update customers" 
ON public.customers FOR UPDATE 
USING (public.is_authenticated_user());

CREATE POLICY "Admins can delete customers" 
ON public.customers FOR DELETE 
USING (public.get_current_user_role() = 'admin');

-- Update other table policies
DROP POLICY IF EXISTS "Allow all operations on customer_tags" ON public.customer_tags;
CREATE POLICY "Authenticated users can manage customer_tags" 
ON public.customer_tags FOR ALL 
USING (public.is_authenticated_user());

DROP POLICY IF EXISTS "Allow all operations on table_preferences" ON public.table_preferences;
CREATE POLICY "Authenticated users can manage table_preferences" 
ON public.table_preferences FOR ALL 
USING (public.is_authenticated_user());

DROP POLICY IF EXISTS "Allow all operations on allergies" ON public.allergies;
CREATE POLICY "Authenticated users can manage allergies" 
ON public.allergies FOR ALL 
USING (public.is_authenticated_user());

DROP POLICY IF EXISTS "Allow all operations on important_notables" ON public.important_notables;
CREATE POLICY "Authenticated users can manage important_notables" 
ON public.important_notables FOR ALL 
USING (public.is_authenticated_user());

DROP POLICY IF EXISTS "Allow all operations on connections" ON public.connections;
CREATE POLICY "Authenticated users can manage connections" 
ON public.connections FOR ALL 
USING (public.is_authenticated_user());

DROP POLICY IF EXISTS "Allow all operations on important_dates" ON public.important_dates;
CREATE POLICY "Authenticated users can manage important_dates" 
ON public.important_dates FOR ALL 
USING (public.is_authenticated_user());

DROP POLICY IF EXISTS "Allow all operations on customer_notes" ON public.customer_notes;
CREATE POLICY "Authenticated users can manage customer_notes" 
ON public.customer_notes FOR ALL 
USING (public.is_authenticated_user());

DROP POLICY IF EXISTS "Allow all operations on food_preferences" ON public.food_preferences;
CREATE POLICY "Authenticated users can manage food_preferences" 
ON public.food_preferences FOR ALL 
USING (public.is_authenticated_user());

DROP POLICY IF EXISTS "Allow all operations on wine_preferences" ON public.wine_preferences;
CREATE POLICY "Authenticated users can manage wine_preferences" 
ON public.wine_preferences FOR ALL 
USING (public.is_authenticated_user());

DROP POLICY IF EXISTS "Allow all operations on cocktail_preferences" ON public.cocktail_preferences;
CREATE POLICY "Authenticated users can manage cocktail_preferences" 
ON public.cocktail_preferences FOR ALL 
USING (public.is_authenticated_user());

DROP POLICY IF EXISTS "Allow all operations on spirits_preferences" ON public.spirits_preferences;
CREATE POLICY "Authenticated users can manage spirits_preferences" 
ON public.spirits_preferences FOR ALL 
USING (public.is_authenticated_user());

DROP POLICY IF EXISTS "Allow all operations on visits" ON public.visits;
CREATE POLICY "Authenticated users can manage visits" 
ON public.visits FOR ALL 
USING (public.is_authenticated_user());

DROP POLICY IF EXISTS "Allow all operations on visit_orders" ON public.visit_orders;
CREATE POLICY "Authenticated users can manage visit_orders" 
ON public.visit_orders FOR ALL 
USING (public.is_authenticated_user());

DROP POLICY IF EXISTS "Allow all operations on reservations" ON public.reservations;
CREATE POLICY "Authenticated users can manage reservations" 
ON public.reservations FOR ALL 
USING (public.is_authenticated_user());

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, role)
  VALUES (
    new.id, 
    new.email,
    CASE 
      WHEN new.email = 'admin@restaurant.com' THEN 'admin'
      ELSE 'staff'
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Secure database functions
CREATE OR REPLACE FUNCTION public.get_guests_by_birthday_month(month_num integer)
RETURNS TABLE(id uuid, name text, email text, phone text, avatar_url text, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $function$
  SELECT c.id, c.name, c.email, c.phone, c.avatar_url, c.created_at, c.updated_at
  FROM public.customers c
  JOIN public.important_dates id ON c.id = id.customer_id
  WHERE EXTRACT(MONTH FROM id.date) = month_num
    AND LOWER(id.event) LIKE '%birthday%'
    AND public.is_authenticated_user()
  ORDER BY c.name;
$function$;

CREATE OR REPLACE FUNCTION public.get_guests_by_anniversary_month(month_num integer)
RETURNS TABLE(id uuid, name text, email text, phone text, avatar_url text, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $function$
  SELECT c.id, c.name, c.email, c.phone, c.avatar_url, c.created_at, c.updated_at
  FROM public.customers c
  JOIN public.important_dates id ON c.id = id.customer_id
  WHERE EXTRACT(MONTH FROM id.date) = month_num
    AND LOWER(id.event) LIKE '%anniversary%'
    AND public.is_authenticated_user()
  ORDER BY c.name;
$function$;

CREATE OR REPLACE FUNCTION public.get_guests_by_tag(tag_name text)
RETURNS TABLE(id uuid, name text, email text, phone text, avatar_url text, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $function$
  SELECT c.id, c.name, c.email, c.phone, c.avatar_url, c.created_at, c.updated_at
  FROM public.customers c
  JOIN public.customer_tags ct ON c.id = ct.customer_id
  WHERE ct.tag_name = tag_name
    AND public.is_authenticated_user()
  ORDER BY c.name;
$function$;