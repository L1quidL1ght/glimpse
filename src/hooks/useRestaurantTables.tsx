
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RestaurantTable {
  id: string;
  section: string;
  name: string;
  capacity: number;
}

export const useRestaurantTables = () => {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('restaurant_tables')
        .select('*')
        .order('section')
        .order('name');

      if (error) throw error;
      setTables(data || []);
    } catch (error) {
      console.error('Error fetching restaurant tables:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const getTablesBySection = (section: string) => {
    return tables.filter(table => table.section === section);
  };

  const getSections = () => {
    const sections = [...new Set(tables.map(table => table.section))];
    return sections.sort();
  };

  return {
    tables,
    loading,
    getTablesBySection,
    getSections,
    refetch: fetchTables,
  };
};
