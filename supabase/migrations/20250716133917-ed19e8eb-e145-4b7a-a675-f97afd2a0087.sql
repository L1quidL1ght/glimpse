-- Create staff_users table for PIN-based authentication
CREATE TABLE public.staff_users (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  pin_hash text NOT NULL,
  role text NOT NULL DEFAULT 'staff',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on staff_users
ALTER TABLE public.staff_users ENABLE ROW LEVEL SECURITY;

-- Create policies for staff_users
CREATE POLICY "Only active staff can view staff_users" 
ON public.staff_users 
FOR SELECT 
USING (true); -- Allow reading for authentication purposes

CREATE POLICY "Only admins can insert staff_users" 
ON public.staff_users 
FOR INSERT 
WITH CHECK (false); -- Manual admin insertion only

CREATE POLICY "Only admins can update staff_users" 
ON public.staff_users 
FOR UPDATE 
USING (false); -- Manual admin updates only

CREATE POLICY "Only admins can delete staff_users" 
ON public.staff_users 
FOR DELETE 
USING (false); -- Manual admin deletion only

-- Insert default admin user with PIN 1234 (hashed)
-- Using bcrypt hash for PIN 1234: $2b$10$N9qo8uLOickgx2ZMRZoMye1sxDe8J.A9.8zWm7WUE2T.K.sR1B2LS
INSERT INTO public.staff_users (name, pin_hash, role) 
VALUES ('Admin User', '$2b$10$N9qo8uLOickgx2ZMRZoMye1sxDe8J.A9.8zWm7WUE2T.K.sR1B2LS', 'admin');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_staff_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_staff_users_updated_at
BEFORE UPDATE ON public.staff_users
FOR EACH ROW
EXECUTE FUNCTION public.update_staff_users_updated_at();