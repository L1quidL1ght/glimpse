-- Add foreign key constraint from reservations to customers
ALTER TABLE public.reservations 
ADD CONSTRAINT fk_reservations_customer_id 
FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;