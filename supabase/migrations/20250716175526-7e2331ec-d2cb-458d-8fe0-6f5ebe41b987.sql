-- Add is_temporary field to customers table
ALTER TABLE public.customers 
ADD COLUMN is_temporary boolean NOT NULL DEFAULT false;