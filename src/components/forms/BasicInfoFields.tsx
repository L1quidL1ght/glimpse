
import React from 'react';
import { Input } from '@/components/ui/input';
import { GuestFormData } from '@/hooks/useGuestForm';

interface BasicInfoFieldsProps {
  formData: GuestFormData;
  updateField: <K extends keyof GuestFormData>(field: K, value: GuestFormData[K]) => void;
  existingPhoneNumbers?: string[];
}

const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({ 
  formData, 
  updateField, 
  existingPhoneNumbers = [] 
}) => {
  const phoneExists = formData.phone && existingPhoneNumbers.includes(formData.phone);

  return (
    <div className="space-y-4">
      {/* Basic Information */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Name *</label>
        <Input
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="Guest name"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Email</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="guest@email.com"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Phone</label>
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          placeholder="(555) 123-4567"
          className={phoneExists ? 'border-destructive' : ''}
        />
        {phoneExists && (
          <div className="text-sm text-destructive">
            This phone number is already in use by another guest
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInfoFields;
