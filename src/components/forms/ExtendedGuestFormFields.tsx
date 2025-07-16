
import React from 'react';
import { GuestFormData } from '@/hooks/useGuestForm';
import BasicInfoFields from './BasicInfoFields';
import TagsInput from './TagsInput';
import TablePreferencesInput from './TablePreferencesInput';
import AllergiesInput from './AllergiesInput';
import ImportantNotablesInput from './ImportantNotablesInput';
import ConnectionsManager from './ConnectionsManager';
import ImportantDatesManager from './ImportantDatesManager';
import PreferencesInputsSection from './PreferencesInputsSection';
import NotesSection from './NotesSection';

interface ExtendedGuestFormFieldsProps {
  formData: GuestFormData;
  updateField: <K extends keyof GuestFormData>(field: K, value: GuestFormData[K]) => void;
  existingPhoneNumbers?: string[];
  customerId?: string;
  connections: Array<{ name: string; relationship: string }>;
  importantDates: Array<{ event: string; date: string }>;
  onConnectionsChange: (connections: Array<{ name: string; relationship: string }>) => void;
  onImportantDatesChange: (dates: Array<{ event: string; date: string }>) => void;
  preferences: {
    food: string[];
    wine: string[];
    cocktail: string[];
    spirits: string[];
  };
  onPreferencesChange: (category: string, preferences: string[]) => void;
}

const ExtendedGuestFormFields: React.FC<ExtendedGuestFormFieldsProps> = ({
  formData,
  updateField,
  existingPhoneNumbers,
  customerId,
  connections,
  importantDates,
  onConnectionsChange,
  onImportantDatesChange,
  preferences,
  onPreferencesChange
}) => {
  return (
    <div className="space-y-6">
      {/* Basic info fields */}
      <BasicInfoFields 
        formData={formData} 
        updateField={updateField} 
        existingPhoneNumbers={existingPhoneNumbers}
      />
      
      {/* Important dates and connections after phone field */}
      <div className="space-y-4">
        <ConnectionsManager
          connections={connections}
          onConnectionsChange={onConnectionsChange}
          excludeCustomerId={customerId}
        />
        
        <ImportantDatesManager
          dates={importantDates}
          onDatesChange={onImportantDatesChange}
        />
      </div>
      
      {/* Rest of the form fields */}
      <div className="space-y-4">
        <TagsInput formData={formData} updateField={updateField} />
        <TablePreferencesInput formData={formData} updateField={updateField} />
        <AllergiesInput formData={formData} updateField={updateField} />
        <ImportantNotablesInput formData={formData} updateField={updateField} />
      </div>
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Preferences</h3>
        <PreferencesInputsSection
          formData={formData}
          updateField={updateField}
        />
      </div>
      
      <NotesSection
        formData={formData}
        updateField={updateField}
      />
    </div>
  );
};

export default ExtendedGuestFormFields;
