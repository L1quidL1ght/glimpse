-- Make all customer fields optional except id and timestamps
-- The name field should remain NOT NULL as it's the minimum required info

-- Update customers table to allow NULL values for optional fields
ALTER TABLE public.customers 
ALTER COLUMN email DROP NOT NULL,
ALTER COLUMN phone DROP NOT NULL,
ALTER COLUMN member_id DROP NOT NULL,
ALTER COLUMN avatar_url DROP NOT NULL;

-- Ensure name is still required (it should already be NOT NULL)
-- ALTER TABLE public.customers ALTER COLUMN name SET NOT NULL; -- Already set

-- The other tables (preferences, tags, etc.) are already designed to be optional
-- since they're separate tables that can be empty