
-- Add member_id column to customers table
ALTER TABLE public.customers 
ADD COLUMN member_id TEXT;

-- Add a unique constraint to ensure member IDs are unique when not null
ALTER TABLE public.customers 
ADD CONSTRAINT unique_member_id UNIQUE (member_id);
