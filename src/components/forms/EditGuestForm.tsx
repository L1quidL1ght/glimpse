
import React from 'react';
import { Button } from '@/components/ui/button';
import { GuestFormData } from '@/hooks/useGuestForm';
import GuestFormFields from './GuestFormFields';

interface EditGuestFormProps {
  formData: GuestFormData;
  updateField: <K extends keyof GuestFormData>(field: K, value: GuestFormData[K]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  existingPhoneNumbers: string[];
}

const EditGuestForm: React.FC<EditGuestFormProps> = ({
  formData,
  updateField,
  onSubmit,
  onCancel,
  isSubmitting,
  existingPhoneNumbers
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <GuestFormFields
        formData={formData}
        updateField={updateField}
        existingPhoneNumbers={existingPhoneNumbers}
      />
      
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Guest'}
        </Button>
      </div>
    </form>
  );
};

export default EditGuestForm;
