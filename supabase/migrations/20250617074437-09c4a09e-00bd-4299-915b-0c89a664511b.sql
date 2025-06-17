
-- Create storage bucket for profile pictures (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for profile pictures
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'profile-pictures');
CREATE POLICY "Authenticated users can upload profile pictures" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-pictures' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their own profile pictures" ON storage.objects FOR UPDATE USING (bucket_id = 'profile-pictures' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete their own profile pictures" ON storage.objects FOR DELETE USING (bucket_id = 'profile-pictures' AND auth.role() = 'authenticated');

-- Create function to get guests by birthday month
CREATE OR REPLACE FUNCTION public.get_guests_by_birthday_month(month_num integer)
RETURNS TABLE (
  id uuid,
  name text,
  email text,
  phone text,
  avatar_url text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
STABLE
AS $$
  SELECT c.id, c.name, c.email, c.phone, c.avatar_url, c.created_at, c.updated_at
  FROM public.customers c
  JOIN public.important_dates id ON c.id = id.customer_id
  WHERE EXTRACT(MONTH FROM id.date) = month_num
    AND LOWER(id.event) LIKE '%birthday%'
  ORDER BY c.name;
$$;

-- Create function to get guests by anniversary month
CREATE OR REPLACE FUNCTION public.get_guests_by_anniversary_month(month_num integer)
RETURNS TABLE (
  id uuid,
  name text,
  email text,
  phone text,
  avatar_url text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
STABLE
AS $$
  SELECT c.id, c.name, c.email, c.phone, c.avatar_url, c.created_at, c.updated_at
  FROM public.customers c
  JOIN public.important_dates id ON c.id = id.customer_id
  WHERE EXTRACT(MONTH FROM id.date) = month_num
    AND LOWER(id.event) LIKE '%anniversary%'
  ORDER BY c.name;
$$;

-- Create function to get guests by tag
CREATE OR REPLACE FUNCTION public.get_guests_by_tag(tag_name text)
RETURNS TABLE (
  id uuid,
  name text,
  email text,
  phone text,
  avatar_url text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
STABLE
AS $$
  SELECT c.id, c.name, c.email, c.phone, c.avatar_url, c.created_at, c.updated_at
  FROM public.customers c
  JOIN public.customer_tags ct ON c.id = ct.customer_id
  WHERE ct.tag_name = tag_name
  ORDER BY c.name;
$$;
