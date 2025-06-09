
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CustomerData {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  tags: string[];
  totalVisits: number;
  lastVisit?: string;
  favoriteTable?: string;
  tablePreferences: string[];
  foodPreferences: Array<{value: string, isGolden: boolean}>;
  winePreferences: Array<{value: string, isGolden: boolean}>;
  cocktailPreferences: Array<{value: string, isGolden: boolean}>;
  spiritsPreferences: Array<{value: string, isGolden: boolean}>;
  allergies: string[];
  importantDates: Array<{event: string, date: string}>;
  connections: Array<{name: string, relationship: string}>;
  visits: Array<{
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
  notes: string;
  importantNotables: string[];
}

export const useCustomerData = (customerId?: string) => {
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomerData = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch basic customer info
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

      if (customerError) throw customerError;

      // Fetch all related data in parallel
      const [
        tagsResult,
        tablePrefsResult,
        foodPrefsResult,
        winePrefsResult,
        cocktailPrefsResult,
        spiritsPrefsResult,
        allergiesResult,
        datesResult,
        notablesResult,
        notesResult,
        visitsResult
      ] = await Promise.all([
        supabase.from('customer_tags').select('tag_name').eq('customer_id', id),
        supabase.from('table_preferences').select('preference').eq('customer_id', id),
        supabase.from('food_preferences').select('preference, is_golden').eq('customer_id', id),
        supabase.from('wine_preferences').select('preference, is_golden').eq('customer_id', id),
        supabase.from('cocktail_preferences').select('preference, is_golden').eq('customer_id', id),
        supabase.from('spirits_preferences').select('preference, is_golden').eq('customer_id', id),
        supabase.from('allergies').select('allergy').eq('customer_id', id),
        supabase.from('important_dates').select('event, date').eq('customer_id', id),
        supabase.from('important_notables').select('notable').eq('customer_id', id),
        supabase.from('customer_notes').select('note').eq('customer_id', id).order('created_at', { ascending: false }).limit(1),
        supabase.from('visits').select('*').eq('customer_id', id).order('visit_date', { ascending: false })
      ]);

      // Transform the data
      const transformedCustomer: CustomerData = {
        ...customerData,
        tags: tagsResult.data?.map(t => t.tag_name) || [],
        tablePreferences: tablePrefsResult.data?.map(p => p.preference) || [],
        foodPreferences: foodPrefsResult.data?.map(p => ({ value: p.preference, isGolden: p.is_golden || false })) || [],
        winePreferences: winePrefsResult.data?.map(p => ({ value: p.preference, isGolden: p.is_golden || false })) || [],
        cocktailPreferences: cocktailPrefsResult.data?.map(p => ({ value: p.preference, isGolden: p.is_golden || false })) || [],
        spiritsPreferences: spiritsPrefsResult.data?.map(p => ({ value: p.preference, isGolden: p.is_golden || false })) || [],
        allergies: allergiesResult.data?.map(a => a.allergy) || [],
        importantDates: datesResult.data?.map(d => ({ event: d.event, date: d.date })) || [],
        importantNotables: notablesResult.data?.map(n => n.notable) || [],
        notes: notesResult.data?.[0]?.note || '',
        connections: [], // Would need to be implemented with actual customer linking
        totalVisits: visitsResult.data?.length || 0,
        lastVisit: visitsResult.data?.[0]?.visit_date,
        favoriteTable: undefined, // Could be calculated from most frequent table
        visits: [] // Would need visit_orders data to be complete
      };

      setCustomer(transformedCustomer);
    } catch (err) {
      console.error('Error fetching customer data:', err);
      setError('Failed to fetch customer data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchCustomerData(customerId);
    }
  }, [customerId]);

  return {
    customer,
    loading,
    error,
    refetch: customerId ? () => fetchCustomerData(customerId) : undefined
  };
};
