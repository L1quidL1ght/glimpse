
-- Add section and table_id columns to reservations table
ALTER TABLE public.reservations 
ADD COLUMN section text,
ADD COLUMN table_id text;

-- Create a tables lookup table for the dropdown options
CREATE TABLE public.restaurant_tables (
  id text PRIMARY KEY,
  section text NOT NULL,
  name text NOT NULL,
  capacity integer NOT NULL DEFAULT 4,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert sample tables for each section
INSERT INTO public.restaurant_tables (id, section, name, capacity) VALUES
-- Tables section
('T1', 'Tables', 'Table 1', 4),
('T2', 'Tables', 'Table 2', 6),
('T3', 'Tables', 'Table 3', 2),
('T4', 'Tables', 'Table 4', 8),
('T5', 'Tables', 'Table 5', 4),
('T6', 'Tables', 'Table 6', 6),

-- Bar section
('B1', 'Bar', 'Bar Seat 1-2', 2),
('B2', 'Bar', 'Bar Seat 3-4', 2),
('B3', 'Bar', 'Bar Seat 5-6', 2),
('B4', 'Bar', 'High Top 1', 4),
('B5', 'Bar', 'High Top 2', 4),

-- Lounge section
('L1', 'Lounge', 'Booth 1', 6),
('L2', 'Lounge', 'Booth 2', 4),
('L3', 'Lounge', 'Sofa Area', 8),
('L4', 'Lounge', 'Corner Table', 4);
