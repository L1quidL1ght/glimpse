-- First, update existing data to use a valid 4-digit PIN
-- Set a default PIN for existing users that they can change later

UPDATE public.staff_users 
SET pin_hash = '1234' 
WHERE pin_hash IS NOT NULL;

-- Now rename the column
ALTER TABLE public.staff_users 
RENAME COLUMN pin_hash TO pin;

-- Add constraint to ensure PIN is exactly 4 digits
ALTER TABLE public.staff_users 
ADD CONSTRAINT pin_format_check CHECK (pin ~ '^\d{4}$');

-- Add unique constraint to prevent duplicate PINs
ALTER TABLE public.staff_users 
ADD CONSTRAINT pin_unique UNIQUE (pin);