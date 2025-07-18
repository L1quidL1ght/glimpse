-- Update the database functions to use staff authentication instead of user authentication
-- This fixes the filtering functions for birthday, anniversary, and tag filters

CREATE OR REPLACE FUNCTION public.get_guests_by_birthday_month(month_num integer)
RETURNS TABLE(id uuid, name text, email text, phone text, avatar_url text, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $function$
  SELECT c.id, c.name, c.email, c.phone, c.avatar_url, c.created_at, c.updated_at
  FROM public.customers c
  JOIN public.important_dates id ON c.id = id.customer_id
  WHERE EXTRACT(MONTH FROM id.date) = month_num
    AND LOWER(id.event) LIKE '%birthday%'
    AND public.is_staff_authenticated()
  ORDER BY c.name;
$function$;

CREATE OR REPLACE FUNCTION public.get_guests_by_anniversary_month(month_num integer)
RETURNS TABLE(id uuid, name text, email text, phone text, avatar_url text, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $function$
  SELECT c.id, c.name, c.email, c.phone, c.avatar_url, c.created_at, c.updated_at
  FROM public.customers c
  JOIN public.important_dates id ON c.id = id.customer_id
  WHERE EXTRACT(MONTH FROM id.date) = month_num
    AND LOWER(id.event) LIKE '%anniversary%'
    AND public.is_staff_authenticated()
  ORDER BY c.name;
$function$;

CREATE OR REPLACE FUNCTION public.get_guests_by_tag(tag_name text)
RETURNS TABLE(id uuid, name text, email text, phone text, avatar_url text, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $function$
  SELECT c.id, c.name, c.email, c.phone, c.avatar_url, c.created_at, c.updated_at
  FROM public.customers c
  JOIN public.customer_tags ct ON c.id = ct.customer_id
  WHERE ct.tag_name = tag_name
    AND public.is_staff_authenticated()
  ORDER BY c.name;
$function$;