
import { useState } from 'react';
import { customerDataService } from '@/services/customerDataService';
import { preferenceService } from '@/services/preferenceService';
import { customerMetadataService } from '@/services/customerMetadataService';
import { GuestFormData } from './useGuestForm';
import { AppErrorHandler, ErrorType } from '@/utils/errorHandling';

export const useGuestFormSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const submitForm = async (formData: GuestFormData, customerId?: string) => {
    setIsSubmitting(true);
    setLastError(null);

    try {
      let customer;

      if (customerId) {
        // Update existing customer
        customer = await customerDataService.updateCustomer(customerId, formData);
        
        // Delete existing related data before inserting new data
        // This is done in a separate try-catch so main operation can continue even if cleanup fails
        try {
          await customerDataService.deleteRelatedData(customerId);
        } catch (cleanupError) {
          console.warn('Some existing data could not be cleaned up:', cleanupError);
          // Continue with saving new data
        }
      } else {
        // Create new customer
        customer = await customerDataService.createCustomer(formData);
      }

      // Track which operations succeeded and failed
      const results = {
        tags: null as Error | null,
        tablePreferences: null as Error | null,
        allergies: null as Error | null,
        importantDates: null as Error | null,
        importantNotables: null as Error | null,
        notes: null as Error | null,
        connections: null as Error | null,
        preferences: null as Error | null,
      };

      // Save all related data with individual error handling
      const saveOperations = [
        { name: 'tags', operation: () => customerMetadataService.saveTags(customer.id, formData.tags) },
        { name: 'tablePreferences', operation: () => customerMetadataService.saveTablePreferences(customer.id, formData.tablePreferences) },
        { name: 'allergies', operation: () => customerMetadataService.saveAllergies(customer.id, formData.allergies) },
        { name: 'importantDates', operation: () => customerMetadataService.saveImportantDates(customer.id, formData.importantDates) },
        { name: 'importantNotables', operation: () => customerMetadataService.saveImportantNotables(customer.id, formData.importantNotables) },
        { name: 'notes', operation: () => customerMetadataService.saveNotes(customer.id, formData.notes) },
        { name: 'connections', operation: () => customerMetadataService.saveConnections(customer.id, formData.connections) },
        { name: 'preferences', operation: () => preferenceService.savePreferences(customer.id, formData) },
      ];

      // Execute all operations with individual error handling
      await Promise.allSettled(
        saveOperations.map(async ({ name, operation }) => {
          try {
            await operation();
          } catch (error) {
            console.warn(`Failed to save ${name}:`, error);
            results[name as keyof typeof results] = error as Error;
          }
        })
      );

      // Check if any critical operations failed
      const criticalFailures = [results.tags, results.notes, results.preferences].filter(Boolean);
      const warnings = [results.tablePreferences, results.allergies, results.importantDates, results.importantNotables, results.connections].filter(Boolean);

      if (criticalFailures.length > 0) {
        console.warn('Some data could not be saved:', { criticalFailures, warnings });
        // Set a warning message but don't throw - the customer was created successfully
        setLastError('Customer saved, but some information could not be saved. Please try editing the customer to add missing details.');
      } else if (warnings.length > 0) {
        console.warn('Some optional data could not be saved:', warnings);
        setLastError('Customer saved successfully, but some optional information could not be saved.');
      }

      console.log('Guest saved successfully:', customer);
      console.log('useGuestFormSubmission: Form submission complete, returning customer data');
      return customer;
    } catch (error) {
      console.error('Failed to save guest:', error);
      
      // Convert to user-friendly error message
      if (error && typeof error === 'object' && 'type' in error) {
        // It's already an AppError
        throw error;
      } else {
        // Convert unknown error to AppError
        const appError = AppErrorHandler.parseSupabaseError(error);
        throw appError;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearError = () => {
    setLastError(null);
  };

  return {
    submitForm,
    isSubmitting,
    lastError,
    clearError,
  };
};
