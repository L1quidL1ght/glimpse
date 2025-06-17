
-- Clear existing table data and add the specific tables requested
DELETE FROM public.restaurant_tables;

-- Insert the 12 main tables plus Table 333 and Table 333-2
INSERT INTO public.restaurant_tables (id, section, name, capacity) VALUES
-- Tables section - 12 main tables
('T1', 'Tables', 'Table 1', 4),
('T2', 'Tables', 'Table 2', 4),
('T3', 'Tables', 'Table 3', 4),
('T4', 'Tables', 'Table 4', 4),
('T5', 'Tables', 'Table 5', 4),
('T6', 'Tables', 'Table 6', 4),
('T7', 'Tables', 'Table 7', 4),
('T8', 'Tables', 'Table 8', 4),
('T9', 'Tables', 'Table 9', 4),
('T10', 'Tables', 'Table 10', 4),
('T11', 'Tables', 'Table 11', 4),
('T12', 'Tables', 'Table 12', 4),
('T333', 'Tables', 'Table 333', 6),
('T333-2', 'Tables', 'Table 333-2', 6),

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
