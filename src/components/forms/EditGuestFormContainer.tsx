
import React, { useState } from 'react';
import { useGuestForm } from '@/hooks/useGuestForm';
import { useCustomerAutocomplete } from '@/hooks/useCustomerAutocomplete';
import { useGuestFormSubmission } from '@/hooks/useGuestFormSubmission';
import ExtendedGuestFormFields from './ExtendedGuestFormFields';

interface EditGuestFormContainerProps {
  customer: any;
  open: boolean;
  onGuestUpdated: () => void;
  onCancel: () => void;
}

const EditGuestFormContainer: React.FC<EditGuestFormContainerProps> = ({
  customer,
  open,
  onGuestUpdated,
  onCancel
}) => {
  const { customers } = useCustomerAutocomplete();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { formData, updateField, setFormData } = useGuestForm(customer);
  const { submitForm } = useGuestFormSubmission();

  // Get existing phone numbers excluding current customer
  const existingPhoneNumbers = customers
    .filter(c => c.id !== customer?.id)
    .map(c => c.phone)
    .filter(Boolean) as string[];

  // Local state for additional form data
  const [connections, setConnections] = useState<Array<{ name: string; relationship: string }>>(
    customer?.connections || []
  );
  const [importantDates, setImportantDates] = useState<Array<{ event: string; date: string }>>(
    customer?.importantDates || []
  );
  const [preferences, setPreferences] = useState({
    food: customer?.foodPreferences?.map((p: any) => p.value) || [],
    wine: customer?.winePreferences?.map((p: any) => p.value) || [],
    cocktail: customer?.cocktailPreferences?.map((p: any) => p.value) || [],
    spirits: customer?.spiritsPreferences?.map((p: any) => p.value) || [],
  });

  const handlePreferencesChange = (category: string, newPreferences: string[]) => {
    setPreferences(prev => ({
      ...prev,
      [category]: newPreferences
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('EditGuestFormContainer: Starting form submission for customer:', customer?.id);
      
      // Merge all form data including connections, dates, and preferences
      const completeFormData = {
        ...formData,
        connections,
        importantDates,
        foodPreferences: preferences.food.map(p => ({ value: p, isGolden: false })),
        winePreferences: preferences.wine.map(p => ({ value: p, isGolden: false })),
        cocktailPreferences: preferences.cocktail.map(p => ({ value: p, isGolden: false })),
        spiritsPreferences: preferences.spirits.map(p => ({ value: p, isGolden: false })),
      };

      console.log('EditGuestFormContainer: Submitting form data:', completeFormData);
      
      const result = await submitForm(completeFormData, customer?.id);
      
      console.log('EditGuestFormContainer: Form submission successful, result:', result);
      console.log('EditGuestFormContainer: Calling onGuestUpdated callback');
      
      await onGuestUpdated();
      
      console.log('EditGuestFormContainer: Guest update complete');
    } catch (error) {
      console.error('EditGuestFormContainer: Error updating guest:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ExtendedGuestFormFields
        formData={formData}
        updateField={updateField}
        existingPhoneNumbers={existingPhoneNumbers}
        customerId={customer?.id}
        connections={connections}
        importantDates={importantDates}
        onConnectionsChange={setConnections}
        onImportantDatesChange={setImportantDates}
        preferences={preferences}
        onPreferencesChange={handlePreferencesChange}
      />
      
      <div className="flex justify-end gap-2 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          {isSubmitting ? 'Updating...' : 'Update Guest'}
        </button>
      </div>
    </form>
  );
};

export default EditGuestFormContainer;
