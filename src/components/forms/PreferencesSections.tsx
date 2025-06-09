
import React from 'react';
import { GuestFormData } from '@/hooks/useGuestForm';
import PreferencesInputsSection from './PreferencesInputsSection';
import ConnectionsSection from './ConnectionsSection';
import ImportantDatesSection from './ImportantDatesSection';
import NotesSection from './NotesSection';

interface PreferencesSectionsProps {
  formData: GuestFormData;
  updateField: <K extends keyof GuestFormData>(field: K, value: GuestFormData[K]) => void;
}

const PreferencesSections: React.FC<PreferencesSectionsProps> = ({ 
  formData, 
  updateField
}) => {
  console.log('PreferencesSections formData:', formData);
  
  return (
    <div className="space-y-6">
      <PreferencesInputsSection
        formData={formData}
        updateField={updateField}
      />

      <ConnectionsSection
        formData={formData}
        updateField={updateField}
      />

      <ImportantDatesSection
        formData={formData}
        updateField={updateField}
      />

      <NotesSection
        formData={formData}
        updateField={updateField}
      />
    </div>
  );
};

export default PreferencesSections;
