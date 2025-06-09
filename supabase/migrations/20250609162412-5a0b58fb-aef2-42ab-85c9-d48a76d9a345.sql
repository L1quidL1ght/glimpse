
-- Enable RLS and create policies for customer_tags table
CREATE POLICY "Allow all operations on customer_tags" ON public.customer_tags
FOR ALL USING (true) WITH CHECK (true);

-- Enable RLS and create policies for other customer-related tables that might have the same issue
CREATE POLICY "Allow all operations on customers" ON public.customers
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on table_preferences" ON public.table_preferences
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on allergies" ON public.allergies
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on important_notables" ON public.important_notables
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on connections" ON public.connections
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on important_dates" ON public.important_dates
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on customer_notes" ON public.customer_notes
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on food_preferences" ON public.food_preferences
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on wine_preferences" ON public.wine_preferences
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on cocktail_preferences" ON public.cocktail_preferences
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on spirits_preferences" ON public.spirits_preferences
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on visits" ON public.visits
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on visit_orders" ON public.visit_orders
FOR ALL USING (true) WITH CHECK (true);
