
import { supabase } from '@/integrations/supabase/client';
import { GuestFormData } from '@/hooks/useGuestForm';
import { AppErrorHandler, ErrorType, ValidationHelpers, handleAsyncError } from '@/utils/errorHandling';

export const customerDataService = {
  async createCustomer(formData: GuestFormData) {
    // Validate required fields
    const nameError = ValidationHelpers.validateRequired(formData.name, 'Name');
    if (nameError) throw nameError;

    // Validate optional fields if provided
    if (formData.email) {
      const emailError = ValidationHelpers.validateEmail(formData.email);
      if (emailError) throw emailError;
    }

    if (formData.phone) {
      const phoneError = ValidationHelpers.validatePhone(formData.phone);
      if (phoneError) throw phoneError;
    }

    const { data, error } = await supabase
      .from('customers')
      .insert({
        name: formData.name.trim(),
        email: formData.email?.trim() || null,
        phone: formData.phone?.trim() || null,
        member_id: formData.memberId?.trim() || null,
      })
      .select()
      .single();

    if (error) {
      const appError = AppErrorHandler.parseSupabaseError(error);
      // Add custom context for customer creation
      if (appError.type === ErrorType.CONFLICT && error.message.includes('phone')) {
        appError.message = 'A customer with this phone number already exists';
        appError.details = 'Please check if this customer is already in the system or use a different phone number';
      }
      throw appError;
    }

    if (!data) {
      throw AppErrorHandler.createError(
        ErrorType.DATABASE,
        'Failed to create customer',
        'The customer was not created successfully. Please try again.'
      );
    }

    return data;
  },

  async updateCustomer(customerId: string, formData: GuestFormData) {
    if (!customerId) {
      throw AppErrorHandler.createError(
        ErrorType.VALIDATION,
        'Customer ID is required',
        'Cannot update customer without a valid ID'
      );
    }

    // Validate required fields
    const nameError = ValidationHelpers.validateRequired(formData.name, 'Name');
    if (nameError) throw nameError;

    // Validate optional fields if provided
    if (formData.email) {
      const emailError = ValidationHelpers.validateEmail(formData.email);
      if (emailError) throw emailError;
    }

    if (formData.phone) {
      const phoneError = ValidationHelpers.validatePhone(formData.phone);
      if (phoneError) throw phoneError;
    }

    const { error } = await supabase
      .from('customers')
      .update({
        name: formData.name.trim(),
        email: formData.email?.trim() || null,
        phone: formData.phone?.trim() || null,
        member_id: formData.memberId?.trim() || null,
      })
      .eq('id', customerId);

    if (error) {
      const appError = AppErrorHandler.parseSupabaseError(error);
      // Add custom context for customer updates
      if (appError.type === ErrorType.NOT_FOUND) {
        appError.message = 'Customer not found';
        appError.details = 'The customer may have been deleted by another user';
      }
      throw appError;
    }

    return { id: customerId };
  },

  async deleteRelatedData(customerId: string) {
    if (!customerId) {
      throw AppErrorHandler.createError(
        ErrorType.VALIDATION,
        'Customer ID is required',
        'Cannot delete related data without a valid customer ID'
      );
    }

    const deletionPromises = [
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
    ];

    try {
      const results = await Promise.allSettled(deletionPromises);
      
      // Check for any failures
      const failures = results.filter(result => result.status === 'rejected');
      if (failures.length > 0) {
        console.warn('Some related data could not be deleted:', failures);
        // Don't throw error for related data cleanup failures - log and continue
      }
    } catch (error) {
      // Log the error but don't fail the operation
      console.error('Error deleting related data:', error);
      // We can continue with the main operation even if some related data couldn't be deleted
    }
  }
};
