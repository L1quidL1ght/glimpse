
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Reservation {
  id: string;
  customer_id: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  section?: string;
  table_id?: string;
  table_preference?: string;
  special_requests?: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  created_at: string;
  updated_at: string;
  customer?: {
    name: string;
    email?: string;
    phone?: string;
  };
}

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReservations = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          customers!customer_id (
            name,
            email,
            phone
          )
        `)
        .order('reservation_date', { ascending: true })
        .order('reservation_time', { ascending: true });

      if (error) throw error;

      // Transform and ensure proper typing with safe customer handling
      const typedReservations: Reservation[] = (data || []).map(item => ({
        ...item,
        status: item.status as 'confirmed' | 'cancelled' | 'completed' | 'no_show',
        customer: item.customers ? {
          name: item.customers.name,
          email: item.customers.email,
          phone: item.customers.phone
        } : undefined
      }));

      setReservations(typedReservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch reservations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createReservation = async (reservationData: Omit<Reservation, 'id' | 'created_at' | 'updated_at' | 'customer' | 'status'>) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert([{
          ...reservationData,
          status: 'confirmed'
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchReservations();
      toast({
        title: "Success",
        description: "Reservation created successfully",
      });

      return data;
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast({
        title: "Error",
        description: "Failed to create reservation",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateReservation = async (id: string, updates: Partial<Reservation>) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      await fetchReservations();
      toast({
        title: "Success",
        description: "Reservation updated successfully",
      });
    } catch (error) {
      console.error('Error updating reservation:', error);
      toast({
        title: "Error",
        description: "Failed to update reservation",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteReservation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchReservations();
      toast({
        title: "Success",
        description: "Reservation deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting reservation:', error);
      toast({
        title: "Error",
        description: "Failed to delete reservation",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return {
    reservations,
    loading,
    createReservation,
    updateReservation,
    deleteReservation,
    refetch: fetchReservations,
  };
};
