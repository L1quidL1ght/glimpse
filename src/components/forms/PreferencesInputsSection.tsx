
import React from 'react';
import { Separator } from '@/components/ui/separator';
import PreferenceInput from './PreferenceInput';
import { GuestFormData } from '@/hooks/useGuestForm';
import { usePreferenceOptions } from '@/hooks/usePreferenceOptions';

interface PreferencesInputsSectionProps {
  formData: GuestFormData;
  updateField: <K extends keyof GuestFormData>(field: K, value: GuestFormData[K]) => void;
}

const PreferencesInputsSection: React.FC<PreferencesInputsSectionProps> = ({ 
  formData, 
  updateField 
}) => {
  const { foodOptions, wineOptions, cocktailOptions, spiritsOptions } = usePreferenceOptions();

  return (
    <div className="space-y-6">
      <Separator />

      {/* Food Preferences */}
      <PreferenceInput
        label="Food Preferences"
        preferences={formData.foodPreferences}
        onChange={(prefs) => updateField('foodPreferences', prefs)}
        options={foodOptions}
      />

      <Separator />

      {/* Wine Preferences */}
      <PreferenceInput
        label="Wine Preferences"
        preferences={formData.winePreferences}
        onChange={(prefs) => updateField('winePreferences', prefs)}
        options={wineOptions}
      />

      <Separator />

      {/* Cocktail Preferences */}
      <PreferenceInput
        label="Cocktail Preferences"
        preferences={formData.cocktailPreferences}
        onChange={(prefs) => updateField('cocktailPreferences', prefs)}
        options={cocktailOptions}
      />

      <Separator />

      {/* Spirits Preferences */}
      <PreferenceInput
        label="Spirits Preferences"
        preferences={formData.spiritsPreferences}
        onChange={(prefs) => updateField('spiritsPreferences', prefs)}
        options={spiritsOptions}
      />
    </div>
  );
};

export default PreferencesInputsSection;
