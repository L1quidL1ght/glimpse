import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCustomerData = (customerId: string) => {
  const queryClient = useQueryClient();

  const fetchCustomerData = async (id: string) => {
    const { data: customer, error } = await supabase
      .from('customers')
      .select(`
        *,
        customer_tags(*),
        table_preferences(*),
        food_preferences(*),
        wine_preferences(*),
        cocktail_preferences(*),
        spirits_preferences(*),
        allergies(*),
        important_dates(*),
        important_notables(*),
        customer_notes(*),
        connections:connections!customer_id(*,
          connected_customer:customers!connected_customer_id(*)
        ),
        visits(*,
          visit_orders(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    // Transform the data to match the expected format
    return {
      ...customer,
      connections: customer.connections?.map((conn: any) => ({
        ...conn,
        customer: conn.connected_customer
      })) || [],
      importantNotables: customer.important_notables?.map((notable: any) => notable.notable) || [],
      importantDates: customer.important_dates || [],
      notes: customer.customer_notes || []
    };
  };

  const query = useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => fetchCustomerData(customerId),
    enabled: !!customerId,
  });

  const invalidateCustomerData = () => {
    queryClient.invalidateQueries({ queryKey: ['customer', customerId] });
  };

  const invalidateAllCustomers = () => {
    queryClient.invalidateQueries({ queryKey: ['customers'] });
  };

  return {
    customer: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    invalidateCustomerData,
    invalidateAllCustomers,
  };
};