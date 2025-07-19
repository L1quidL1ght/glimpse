-- Create function to handle bidirectional connections
CREATE OR REPLACE FUNCTION public.create_bidirectional_connection(
  p_customer_id uuid,
  p_connected_customer_id uuid,
  p_relationship text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  reciprocal_relationship text;
BEGIN
  -- Prevent self-connections
  IF p_customer_id = p_connected_customer_id THEN
    RETURN;
  END IF;
  
  -- Determine reciprocal relationship
  reciprocal_relationship := CASE 
    WHEN LOWER(p_relationship) = 'spouse' THEN 'spouse'
    WHEN LOWER(p_relationship) = 'partner' THEN 'partner'
    WHEN LOWER(p_relationship) = 'friend' THEN 'friend'
    WHEN LOWER(p_relationship) = 'family' THEN 'family'
    WHEN LOWER(p_relationship) = 'colleague' THEN 'colleague'
    WHEN LOWER(p_relationship) = 'business partner' THEN 'business partner'
    ELSE p_relationship -- Default to same relationship
  END;
  
  -- Insert the primary connection (if it doesn't exist)
  INSERT INTO public.connections (customer_id, connected_customer_id, relationship)
  VALUES (p_customer_id, p_connected_customer_id, p_relationship)
  ON CONFLICT (customer_id, connected_customer_id) DO NOTHING;
  
  -- Insert the reciprocal connection (if it doesn't exist)
  INSERT INTO public.connections (customer_id, connected_customer_id, relationship)
  VALUES (p_connected_customer_id, p_customer_id, reciprocal_relationship)
  ON CONFLICT (customer_id, connected_customer_id) DO NOTHING;
END;
$$;

-- Add unique constraint to prevent duplicate connections (if it doesn't already exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_customer_connection'
    ) THEN
        ALTER TABLE public.connections 
        ADD CONSTRAINT unique_customer_connection 
        UNIQUE (customer_id, connected_customer_id);
    END IF;
END $$;