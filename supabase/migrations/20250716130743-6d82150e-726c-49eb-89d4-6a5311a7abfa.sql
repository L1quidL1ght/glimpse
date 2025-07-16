-- Update the handle_new_user function to use lorenzo@herouei.com as the admin email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, role)
  VALUES (
    new.id, 
    new.email,
    CASE 
      WHEN new.email = 'lorenzo@herouei.com' THEN 'admin'
      ELSE 'staff'
    END
  );
  RETURN new;
END;
$function$;