
import { supabase } from '@/integrations/supabase/client';
import { GuestFormData } from '@/hooks/useGuestForm';

export const customerMetadataService = {
  async saveTags(customerId: string, tags: string[]) {
    if (tags.length > 0) {
      const tagInserts = tags.map(tag => ({
        customer_id: customerId,
        tag_name: tag
      }));
      await supabase.from('customer_tags').insert(tagInserts);
    }
  },

  async saveTablePreferences(customerId: string, preferences: string[]) {
    if (preferences.length > 0) {
      const tablePrefs = preferences.map(pref => ({
        customer_id: customerId,
        preference: pref
      }));
      await supabase.from('table_preferences').insert(tablePrefs);
    }
  },

  async saveAllergies(customerId: string, allergies: string[]) {
    if (allergies.length > 0) {
      const allergyInserts = allergies.map(allergy => ({
        customer_id: customerId,
        allergy: allergy
      }));
      await supabase.from('allergies').insert(allergyInserts);
    }
  },

  async saveImportantDates(customerId: string, dates: Array<{ event: string; date: string }>) {
    if (dates.length > 0) {
      const dateInserts = dates.map(dateItem => ({
        customer_id: customerId,
        event: dateItem.event,
        date: dateItem.date
      }));
      await supabase.from('important_dates').insert(dateInserts);
    }
  },

  async saveImportantNotables(customerId: string, notables: string[]) {
    if (notables.length > 0) {
      const notableInserts = notables.map(notable => ({
        customer_id: customerId,
        notable: notable
      }));
      await supabase.from('important_notables').insert(notableInserts);
    }
  },

  async saveNotes(customerId: string, notes: string) {
    if (notes.trim()) {
      await supabase.from('customer_notes').insert({
        customer_id: customerId,
        note: notes.trim()
      });
    }
  },

  async saveConnections(customerId: string, connections: Array<{ name: string; relationship: string }>) {
    if (connections.length > 0) {
      for (const connection of connections) {
        const { data: connectedCustomer } = await supabase
          .from('customers')
          .select('id')
          .eq('name', connection.name)
          .single();

        if (connectedCustomer) {
          await supabase.from('connections').insert({
            customer_id: customerId,
            connected_customer_id: connectedCustomer.id,
            relationship: connection.relationship
          });
        }
      }
    }
  }
};
