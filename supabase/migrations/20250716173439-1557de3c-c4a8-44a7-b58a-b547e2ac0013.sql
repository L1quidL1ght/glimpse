-- Update staff_users table to use plaintext PIN instead of hashed PIN
-- Change pin_hash column to pin for 4-digit plaintext storage

ALTER TABLE public.staff_users 
RENAME COLUMN pin_hash TO pin;

-- Add constraint to ensure PIN is exactly 4 digits
ALTER TABLE public.staff_users 
ADD CONSTRAINT pin_format_check CHECK (pin ~ '^\d{4}$');

-- Add unique constraint to prevent duplicate PINs
ALTER TABLE public.staff_users 
ADD CONSTRAINT pin_unique UNIQUE (pin);