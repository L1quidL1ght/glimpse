
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCustomerAutocomplete = () => {
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers-autocomplete'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('id, name, email, phone')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  return {
    customers,
    isLoading,
  };
};
