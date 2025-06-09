
import React, { useState } from 'react';
import { useGuestForm } from '@/hooks/useGuestForm';
import { useCustomerAutocomplete } from '@/hooks/useCustomerAutocomplete';
import ExtendedGuestFormFields from './ExtendedGuestFormFields';
import { useGuestFormState } from './GuestFormState';
import { useGuestFormSubmission } from './GuestFormSubmission';

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
  const { formData, updateField, setFormData } = useGuestForm();

  // Get existing phone numbers excluding current customer
  const existingPhoneNumbers = customers
    .filter(c => c.id !== customer?.id)
    .map(c => c.phone)
    .filter(Boolean) as string[];

  const {
    connections,
    setConnections,
    importantDates,
    setImportantDates,
    preferences,
    handlePreferencesChange
  } = useGuestFormState({ customer, open, setFormData });

  const { handleSubmit } = useGuestFormSubmission({
    customer,
    formData,
    connections,
    importantDates,
    preferences,
    onGuestUpdated,
    setIsSubmitting
  });

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
