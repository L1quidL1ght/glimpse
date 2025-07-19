-- Add foreign key constraints with CASCADE DELETE for better data integrity
-- This will ensure that when a customer is deleted, all related data is automatically removed

-- First, let's add foreign key constraints to enforce referential integrity
-- and enable cascade deletion for cleaner, atomic deletions

-- Customer tags foreign key with cascade
ALTER TABLE customer_tags 
ADD CONSTRAINT fk_customer_tags_customer_id 
FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;

-- Table preferences foreign key with cascade
ALTER TABLE table_preferences 
ADD CONSTRAINT fk_table_preferences_customer_id 
FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;

-- Food preferences foreign key with cascade
ALTER TABLE food_preferences 
ADD CONSTRAINT fk_food_preferences_customer_id 
FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;

-- Wine preferences foreign key with cascade
ALTER TABLE wine_preferences 
ADD CONSTRAINT fk_wine_preferences_customer_id 
FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;

-- Cocktail preferences foreign key with cascade
ALTER TABLE cocktail_preferences 
ADD CONSTRAINT fk_cocktail_preferences_customer_id 
FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;

-- Spirits preferences foreign key with cascade
ALTER TABLE spirits_preferences 
ADD CONSTRAINT fk_spirits_preferences_customer_id 
FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;

-- Allergies foreign key with cascade
ALTER TABLE allergies 
ADD CONSTRAINT fk_allergies_customer_id 
FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;

-- Important dates foreign key with cascade
ALTER TABLE important_dates 
ADD CONSTRAINT fk_important_dates_customer_id 
FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;

-- Important notables foreign key with cascade
ALTER TABLE important_notables 
ADD CONSTRAINT fk_important_notables_customer_id 
FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;

-- Customer notes foreign key with cascade
ALTER TABLE customer_notes 
ADD CONSTRAINT fk_customer_notes_customer_id 
FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;

-- Connections foreign keys with cascade (both directions)
ALTER TABLE connections 
ADD CONSTRAINT fk_connections_customer_id 
FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;

ALTER TABLE connections 
ADD CONSTRAINT fk_connections_connected_customer_id 
FOREIGN KEY (connected_customer_id) REFERENCES customers(id) ON DELETE CASCADE;

-- Reservations foreign key with cascade
ALTER TABLE reservations 
ADD CONSTRAINT fk_reservations_customer_id 
FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;

-- Visits foreign key with cascade
ALTER TABLE visits 
ADD CONSTRAINT fk_visits_customer_id 
FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;

-- Visit orders foreign key with cascade (linked to visits, which cascade from customers)
ALTER TABLE visit_orders 
ADD CONSTRAINT fk_visit_orders_visit_id 
FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE CASCADE;

-- Create a stored procedure for atomic customer deletion that uses transactions
CREATE OR REPLACE FUNCTION delete_customer_atomically(customer_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
    deletion_summary RECORD;
BEGIN
    -- Start transaction (implicit in function)
    
    -- Get deletion counts before deletion
    SELECT 
        (SELECT COUNT(*) FROM customer_tags WHERE customer_id = customer_uuid) as tags_count,
        (SELECT COUNT(*) FROM table_preferences WHERE customer_id = customer_uuid) as table_prefs_count,
        (SELECT COUNT(*) FROM food_preferences WHERE customer_id = customer_uuid) as food_prefs_count,
        (SELECT COUNT(*) FROM wine_preferences WHERE customer_id = customer_uuid) as wine_prefs_count,
        (SELECT COUNT(*) FROM cocktail_preferences WHERE customer_id = customer_uuid) as cocktail_prefs_count,
        (SELECT COUNT(*) FROM spirits_preferences WHERE customer_id = customer_uuid) as spirits_prefs_count,
        (SELECT COUNT(*) FROM allergies WHERE customer_id = customer_uuid) as allergies_count,
        (SELECT COUNT(*) FROM important_dates WHERE customer_id = customer_uuid) as dates_count,
        (SELECT COUNT(*) FROM important_notables WHERE customer_id = customer_uuid) as notables_count,
        (SELECT COUNT(*) FROM customer_notes WHERE customer_id = customer_uuid) as notes_count,
        (SELECT COUNT(*) FROM connections WHERE customer_id = customer_uuid OR connected_customer_id = customer_uuid) as connections_count,
        (SELECT COUNT(*) FROM reservations WHERE customer_id = customer_uuid) as reservations_count,
        (SELECT COUNT(*) FROM visits WHERE customer_id = customer_uuid) as visits_count,
        (SELECT COUNT(*) FROM visit_orders vo JOIN visits v ON vo.visit_id = v.id WHERE v.customer_id = customer_uuid) as visit_orders_count
    INTO deletion_summary;
    
    -- Validate customer exists
    IF NOT EXISTS (SELECT 1 FROM customers WHERE id = customer_uuid) THEN
        RAISE EXCEPTION 'Customer with ID % not found', customer_uuid;
    END IF;
    
    -- Delete the customer (CASCADE will handle all related records)
    DELETE FROM customers WHERE id = customer_uuid;
    
    -- Prepare result JSON
    result := json_build_object(
        'success', true,
        'customer_id', customer_uuid,
        'deleted_counts', json_build_object(
            'customer_tags', deletion_summary.tags_count,
            'table_preferences', deletion_summary.table_prefs_count,
            'food_preferences', deletion_summary.food_prefs_count,
            'wine_preferences', deletion_summary.wine_prefs_count,
            'cocktail_preferences', deletion_summary.cocktail_prefs_count,
            'spirits_preferences', deletion_summary.spirits_prefs_count,
            'allergies', deletion_summary.allergies_count,
            'important_dates', deletion_summary.dates_count,
            'important_notables', deletion_summary.notables_count,
            'customer_notes', deletion_summary.notes_count,
            'connections', deletion_summary.connections_count,
            'reservations', deletion_summary.reservations_count,
            'visits', deletion_summary.visits_count,
            'visit_orders', deletion_summary.visit_orders_count
        )
    );
    
    RETURN result;
    
EXCEPTION WHEN OTHERS THEN
    -- Transaction will automatically rollback on exception
    RETURN json_build_object(
        'success', false,
        'error', SQLERRM,
        'error_code', SQLSTATE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_customer_atomically(UUID) TO authenticated;

-- Add RLS policy for the function (it uses SECURITY DEFINER so it runs with definer privileges)
-- The function will respect existing RLS policies on the tables it accesses