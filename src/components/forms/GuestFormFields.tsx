
import React from 'react';
import { GuestFormData } from '@/hooks/useGuestForm';
import BasicInfoFields from './BasicInfoFields';
import TagsInput from './TagsInput';
import TablePreferencesInput from './TablePreferencesInput';
import AllergiesInput from './AllergiesInput';
import ImportantNotablesInput from './ImportantNotablesInput';

interface GuestFormFieldsProps {
  formData: GuestFormData;
  updateField: <K extends keyof GuestFormData>(field: K, value: GuestFormData[K]) => void;
  existingPhoneNumbers?: string[];
}

const GuestFormFields: React.FC<GuestFormFieldsProps> = ({ 
  formData, 
  updateField, 
  existingPhoneNumbers 
}) => {
  return (
    <div className="space-y-4">
      <BasicInfoFields 
        formData={formData} 
        updateField={updateField} 
        existingPhoneNumbers={existingPhoneNumbers}
      />
      <TagsInput formData={formData} updateField={updateField} />
      <TablePreferencesInput formData={formData} updateField={updateField} />
      <AllergiesInput formData={formData} updateField={updateField} />
      <ImportantNotablesInput formData={formData} updateField={updateField} />
    </div>
  );
};

export default GuestFormFields;
