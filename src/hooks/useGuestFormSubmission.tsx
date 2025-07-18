
import { useState } from 'react';
import { customerDataService } from '@/services/customerDataService';
import { preferenceService } from '@/services/preferenceService';
import { customerMetadataService } from '@/services/customerMetadataService';
import { GuestFormData } from './useGuestForm';

export const useGuestFormSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async (formData: GuestFormData, customerId?: string) => {
    setIsSubmitting(true);

    try {
      let customer;

      if (customerId) {
        // Update existing customer
        customer = await customerDataService.updateCustomer(customerId, formData);
        // Delete existing related data before inserting new data
        await customerDataService.deleteRelatedData(customerId);
      } else {
        // Create new customer
        customer = await customerDataService.createCustomer(formData);
      }

      // Save all related data using the services
      await Promise.all([
        customerMetadataService.saveTags(customer.id, formData.tags),
        customerMetadataService.saveTablePreferences(customer.id, formData.tablePreferences),
        customerMetadataService.saveAllergies(customer.id, formData.allergies),
        customerMetadataService.saveImportantDates(customer.id, formData.importantDates),
        customerMetadataService.saveImportantNotables(customer.id, formData.importantNotables),
        customerMetadataService.saveNotes(customer.id, formData.notes),
        customerMetadataService.saveConnections(customer.id, formData.connections),
        preferenceService.savePreferences(customer.id, formData)
      ]);

      console.log('Guest saved successfully:', customer);
      return customer;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitForm,
    isSubmitting,
  };
};
