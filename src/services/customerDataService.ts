
import { supabase } from '@/integrations/supabase/client';
import { GuestFormData } from '@/hooks/useGuestForm';

export const customerDataService = {
  async createCustomer(formData: GuestFormData) {
    const { data, error } = await supabase
      .from('customers')
      .insert({
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        member_id: formData.memberId.trim() || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCustomer(customerId: string, formData: GuestFormData) {
    const { error } = await supabase
      .from('customers')
      .update({
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        member_id: formData.memberId.trim() || null,
      })
      .eq('id', customerId);

    if (error) throw error;
    return { id: customerId };
  },

  async deleteRelatedData(customerId: string) {
    await Promise.all([
      supabase.from('customer_tags').delete().eq('customer_id', customerId),
      supabase.from('table_preferences').delete().eq('customer_id', customerId),
      supabase.from('food_preferences').delete().eq('customer_id', customerId),
      supabase.from('wine_preferences').delete().eq('customer_id', customerId),
      supabase.from('cocktail_preferences').delete().eq('customer_id', customerId),
      supabase.from('spirits_preferences').delete().eq('customer_id', customerId),
      supabase.from('allergies').delete().eq('customer_id', customerId),
      supabase.from('important_dates').delete().eq('customer_id', customerId),
      supabase.from('important_notables').delete().eq('customer_id', customerId),
      supabase.from('customer_notes').delete().eq('customer_id', customerId),
      supabase.from('connections').delete().eq('customer_id', customerId),
    ]);
  }
};
