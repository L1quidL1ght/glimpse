
import React from 'react';
import { GuestFormData } from '@/hooks/useGuestForm';
import GuestFormFields from './GuestFormFields';
import ConnectionsManager from './ConnectionsManager';
import ImportantDatesManager from './ImportantDatesManager';
import PreferencesSections from './PreferencesSections';

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
      <GuestFormFields
        formData={formData}
        updateField={updateField}
        existingPhoneNumbers={existingPhoneNumbers}
      />
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Additional Information</h3>
        
        <div className="space-y-6">
          <ConnectionsManager
            connections={connections}
            onConnectionsChange={onConnectionsChange}
            excludeCustomerId={customerId}
          />
          
          <ImportantDatesManager
            dates={importantDates}
            onDatesChange={onImportantDatesChange}
          />
          
          <PreferencesSections
            preferences={preferences}
            onPreferencesChange={onPreferencesChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ExtendedGuestFormFields;
