import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StaffUser } from '@/pages/Settings';

const STAFF_USERS_QUERY_KEY = ['staff-users'];

// Fetch staff users
export const useStaffUsers = () => {
  return useQuery({
    queryKey: STAFF_USERS_QUERY_KEY,
    queryFn: async (): Promise<StaffUser[]> => {
      const { data, error } = await supabase.functions.invoke('staff-management', {
        body: { action: 'list' },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      return data.data || [];
    },
  });
};

// Create staff user
export const useCreateStaffUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: { name: string; pin: string; role: string }) => {
      const { data, error } = await supabase.functions.invoke('staff-management', {
        body: { ...userData, action: 'create' },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_USERS_QUERY_KEY });
    },
  });
};

// Update staff user
export const useUpdateStaffUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: { 
      id: string; 
      name?: string; 
      pin?: string; 
      role?: string; 
      is_active?: boolean;
    }) => {
      const { data, error } = await supabase.functions.invoke('staff-management', {
        body: { ...userData, action: 'update' },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_USERS_QUERY_KEY });
    },
  });
};

// Delete staff user
export const useDeleteStaffUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.functions.invoke('staff-management', {
        body: { id: userId, action: 'delete' },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_USERS_QUERY_KEY });
    },
  });
};