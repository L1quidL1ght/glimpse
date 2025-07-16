import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StaffUser } from '@/pages/Settings';

const STAFF_USERS_QUERY_KEY = ['staff-users'];

// Fetch staff users
export const useStaffUsers = () => {
  return useQuery({
    queryKey: STAFF_USERS_QUERY_KEY,
    queryFn: async (): Promise<StaffUser[]> => {
      console.log('Fetching staff users...');
      
      const { data, error } = await supabase.functions.invoke('staff-management', {
        body: { action: 'list' },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Failed to fetch staff users: ${error.message}`);
      }
      
      if (data.error) {
        console.error('Function returned error:', data.error);
        throw new Error(data.error);
      }

      console.log(`Retrieved ${data.data?.length || 0} staff users`);
      return data.data || [];
    },
  });
};

// Create staff user
export const useCreateStaffUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: { name: string; pin: string; role: string }) => {
      console.log('Creating staff user:', { name: userData.name, role: userData.role });
      
      const { data, error } = await supabase.functions.invoke('staff-management', {
        body: { ...userData, action: 'create' },
      });

      if (error) {
        console.error('Error creating staff user:', error);
        throw new Error(`Failed to create staff user: ${error.message}`);
      }
      
      if (data.error) {
        console.error('Function returned error:', data.error);
        throw new Error(data.error);
      }

      console.log('Staff user created successfully:', data.data);
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
      console.log('Updating staff user:', userData.id);
      
      const { data, error } = await supabase.functions.invoke('staff-management', {
        body: { ...userData, action: 'update' },
      });

      if (error) {
        console.error('Error updating staff user:', error);
        throw new Error(`Failed to update staff user: ${error.message}`);
      }
      
      if (data.error) {
        console.error('Function returned error:', data.error);
        throw new Error(data.error);
      }

      console.log('Staff user updated successfully:', data.data);
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
      console.log('Deleting staff user:', userId);
      
      const { data, error } = await supabase.functions.invoke('staff-management', {
        body: { id: userId, action: 'delete' },
      });

      if (error) {
        console.error('Error deleting staff user:', error);
        throw new Error(`Failed to delete staff user: ${error.message}`);
      }
      
      if (data.error) {
        console.error('Function returned error:', data.error);
        throw new Error(data.error);
      }

      console.log('Staff user deleted successfully');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_USERS_QUERY_KEY });
    },
  });
};