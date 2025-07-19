
import { supabase } from '@/integrations/supabase/client';
import { GuestFormData } from '@/hooks/useGuestForm';
import { AppErrorHandler, ErrorType, handleAsyncError } from '@/utils/errorHandling';

export const customerMetadataService = {
  async saveTags(customerId: string, tags: string[]) {
    if (!customerId) {
      throw AppErrorHandler.createError(
        ErrorType.VALIDATION,
        'Customer ID is required',
        'Cannot save tags without a valid customer ID'
      );
    }

    if (tags.length > 0) {
      const tagInserts = tags.map(tag => ({
        customer_id: customerId,
        tag_name: tag.trim()
      }));

      const { error } = await supabase.from('customer_tags').insert(tagInserts);
      if (error) {
        const appError = AppErrorHandler.parseSupabaseError(error);
        appError.message = 'Failed to save customer tags';
        throw appError;
      }
    }
  },

  async saveTablePreferences(customerId: string, preferences: string[]) {
    if (!customerId) {
      throw AppErrorHandler.createError(
        ErrorType.VALIDATION,
        'Customer ID is required',
        'Cannot save table preferences without a valid customer ID'
      );
    }

    if (preferences.length > 0) {
      const tablePrefs = preferences.map(pref => ({
        customer_id: customerId,
        preference: pref.trim()
      }));

      const { error } = await supabase.from('table_preferences').insert(tablePrefs);
      if (error) {
        const appError = AppErrorHandler.parseSupabaseError(error);
        appError.message = 'Failed to save table preferences';
        throw appError;
      }
    }
  },

  async saveAllergies(customerId: string, allergies: string[]) {
    if (!customerId) {
      throw AppErrorHandler.createError(
        ErrorType.VALIDATION,
        'Customer ID is required',
        'Cannot save allergies without a valid customer ID'
      );
    }

    if (allergies.length > 0) {
      const allergyInserts = allergies.map(allergy => ({
        customer_id: customerId,
        allergy: allergy.trim()
      }));

      const { error } = await supabase.from('allergies').insert(allergyInserts);
      if (error) {
        const appError = AppErrorHandler.parseSupabaseError(error);
        appError.message = 'Failed to save customer allergies';
        throw appError;
      }
    }
  },

  async saveImportantDates(customerId: string, dates: Array<{ event: string; date: string }>) {
    if (!customerId) {
      throw AppErrorHandler.createError(
        ErrorType.VALIDATION,
        'Customer ID is required',
        'Cannot save important dates without a valid customer ID'
      );
    }

    if (dates.length > 0) {
      // Validate date format
      const validDates = dates.filter(dateItem => {
        if (!dateItem.event?.trim() || !dateItem.date?.trim()) return false;
        // Basic date validation
        const date = new Date(dateItem.date);
        return !isNaN(date.getTime());
      });

      if (validDates.length !== dates.length) {
        throw AppErrorHandler.createError(
          ErrorType.VALIDATION,
          'Invalid date format detected',
          'Please ensure all dates are in a valid format (YYYY-MM-DD)'
        );
      }

      const dateInserts = validDates.map(dateItem => ({
        customer_id: customerId,
        event: dateItem.event.trim(),
        date: dateItem.date
      }));

      const { error } = await supabase.from('important_dates').insert(dateInserts);
      if (error) {
        const appError = AppErrorHandler.parseSupabaseError(error);
        appError.message = 'Failed to save important dates';
        throw appError;
      }
    }
  },

  async saveImportantNotables(customerId: string, notables: string[]) {
    if (!customerId) {
      throw AppErrorHandler.createError(
        ErrorType.VALIDATION,
        'Customer ID is required',
        'Cannot save important notables without a valid customer ID'
      );
    }

    if (notables.length > 0) {
      const notableInserts = notables
        .filter(notable => notable.trim().length > 0)
        .map(notable => ({
          customer_id: customerId,
          notable: notable.trim()
        }));

      if (notableInserts.length > 0) {
        const { error } = await supabase.from('important_notables').insert(notableInserts);
        if (error) {
          const appError = AppErrorHandler.parseSupabaseError(error);
          appError.message = 'Failed to save important notables';
          throw appError;
        }
      }
    }
  },

  async saveNotes(customerId: string, notes: string) {
    if (!customerId) {
      throw AppErrorHandler.createError(
        ErrorType.VALIDATION,
        'Customer ID is required',
        'Cannot save notes without a valid customer ID'
      );
    }

    if (notes.trim()) {
      const { error } = await supabase.from('customer_notes').insert({
        customer_id: customerId,
        note: notes.trim()
      });

      if (error) {
        const appError = AppErrorHandler.parseSupabaseError(error);
        appError.message = 'Failed to save customer notes';
        throw appError;
      }
    }
  },

  async saveConnections(customerId: string, connections: Array<{ name: string; relationship: string }>) {
    if (!customerId) {
      throw AppErrorHandler.createError(
        ErrorType.VALIDATION,
        'Customer ID is required',
        'Cannot save connections without a valid customer ID'
      );
    }

    if (connections.length > 0) {
      const validConnections = connections.filter(conn => 
        conn.name?.trim() && conn.relationship?.trim()
      );

      for (const connection of validConnections) {
        try {
          const { data: connectedCustomer, error: searchError } = await supabase
            .from('customers')
            .select('id')
            .eq('name', connection.name.trim())
            .maybeSingle();

          if (searchError) {
            console.warn(`Failed to find customer "${connection.name}":`, searchError);
            continue; // Skip this connection but continue with others
          }

          if (connectedCustomer) {
            // Use the bidirectional connection function
            const { error: connectionError } = await supabase.rpc('create_bidirectional_connection', {
              p_customer_id: customerId,
              p_connected_customer_id: connectedCustomer.id,
              p_relationship: connection.relationship.trim()
            });

            if (connectionError) {
              console.warn(`Failed to save bidirectional connection to "${connection.name}":`, connectionError);
              // Don't throw - continue with other connections
            }
          } else {
            console.warn(`Customer "${connection.name}" not found - skipping connection`);
          }
        } catch (error) {
          console.warn(`Error processing connection "${connection.name}":`, error);
          // Continue with other connections
        }
      }
    }
  }
};
