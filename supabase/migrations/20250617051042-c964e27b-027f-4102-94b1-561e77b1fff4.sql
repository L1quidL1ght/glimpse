
-- Create reservations table
CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  party_size INTEGER NOT NULL DEFAULT 1,
  table_preference TEXT,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no_show')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraint to customers table
ALTER TABLE public.reservations 
ADD CONSTRAINT fk_reservations_customer 
FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;

-- Create index for faster queries
CREATE INDEX idx_reservations_customer_id ON public.reservations(customer_id);
CREATE INDEX idx_reservations_date ON public.reservations(reservation_date);
CREATE INDEX idx_reservations_status ON public.reservations(status);

-- Add RLS policies
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Allow full access since this is an admin dashboard
CREATE POLICY "Allow all operations on reservations" 
  ON public.reservations 
  FOR ALL 
  USING (true);
