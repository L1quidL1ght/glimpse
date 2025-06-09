
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  tags?: string[];
  totalVisits?: number;
  lastVisit?: string;
  favoriteTable?: string;
  tablePreferences?: string[];
  foodPreferences?: Array<{value: string, isGolden: boolean}>;
  winePreferences?: Array<{value: string, isGolden: boolean}>;
  cocktailPreferences?: Array<{value: string, isGolden: boolean}>;
  spiritsPreferences?: Array<{value: string, isGolden: boolean}>;
  allergies?: string[];
  importantDates?: Array<{event: string, date: string}>;
  connections?: Array<{name: string, relationship: string}>;
  visits?: Array<{
    date: string;
    party: number;
    table: string;
    notes: string;
    orders: {
      appetizers: string[];
      entrees: string[];
      cocktails: string[];
      desserts: string[];
    };
  }>;
  notes?: string;
  importantNotables?: string[];
}

export const useCustomerDashboard = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select(`
          *,
          customer_tags (tag_name),
          table_preferences (preference),
          food_preferences (preference, is_golden),
          wine_preferences (preference, is_golden),
          cocktail_preferences (preference, is_golden),
          spirits_preferences (preference, is_golden),
          allergies (allergy),
          important_dates (event, date),
          important_notables (notable),
          customer_notes (note),
          visits (
            visit_date,
            party_size,
            table_name,
            notes,
            visit_orders (category, item)
          ),
          connections!connections_customer_id_fkey (
            relationship,
            connected_customer:customers!connections_connected_customer_id_fkey (name)
          )
        `)
        .order('name');

      if (customersError) throw customersError;

      const transformedCustomers: Customer[] = customersData.map(customer => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        avatar_url: customer.avatar_url,
        created_at: customer.created_at,
        updated_at: customer.updated_at,
        tags: customer.customer_tags?.map((tag: any) => tag.tag_name) || [],
        tablePreferences: customer.table_preferences?.map((pref: any) => pref.preference) || [],
        foodPreferences: customer.food_preferences?.map((pref: any) => ({
          value: pref.preference,
          isGolden: pref.is_golden
        })) || [],
        winePreferences: customer.wine_preferences?.map((pref: any) => ({
          value: pref.preference,
          isGolden: pref.is_golden
        })) || [],
        cocktailPreferences: customer.cocktail_preferences?.map((pref: any) => ({
          value: pref.preference,
          isGolden: pref.is_golden
        })) || [],
        spiritsPreferences: customer.spirits_preferences?.map((pref: any) => ({
          value: pref.preference,
          isGolden: pref.is_golden
        })) || [],
        allergies: customer.allergies?.map((allergy: any) => allergy.allergy) || [],
        importantDates: customer.important_dates?.map((date: any) => ({
          event: date.event,
          date: date.date
        })) || [],
        importantNotables: customer.important_notables?.map((notable: any) => notable.notable) || [],
        notes: customer.customer_notes?.[0]?.note || '',
        connections: customer.connections?.map((conn: any) => ({
          name: conn.connected_customer?.name || '',
          relationship: conn.relationship
        })) || [],
        visits: customer.visits?.map((visit: any) => {
          const ordersByCategory = visit.visit_orders?.reduce((acc: any, order: any) => {
            if (!acc[order.category]) acc[order.category] = [];
            acc[order.category].push(order.item);
            return acc;
          }, {});

          return {
            date: visit.visit_date,
            party: visit.party_size,
            table: visit.table_name || '',
            notes: visit.notes || '',
            orders: {
              appetizers: ordersByCategory?.appetizers || [],
              entrees: ordersByCategory?.entrees || [],
              cocktails: ordersByCategory?.cocktails || [],
              desserts: ordersByCategory?.desserts || []
            }
          };
        }) || [],
        totalVisits: customer.visits?.length || 0,
        lastVisit: customer.visits?.[0]?.visit_date
      }));

      setCustomers(transformedCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAdded = () => {
    fetchCustomers();
    toast({
      title: "Success",
      description: "Guest list updated successfully",
    });
  };

  return {
    customers,
    loading,
    fetchCustomers,
    handleGuestAdded
  };
};
