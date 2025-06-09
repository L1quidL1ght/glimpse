
import { useState } from 'react';

interface PreferenceItem {
  value: string;
  isGolden: boolean;
}

interface Connection {
  name: string;
  relationship: string;
}

interface ImportantDate {
  event: string;
  date: string;
}

export interface GuestFormData {
  name: string;
  email: string;
  phone: string;
  tags: string[];
  tablePreferences: string[];
  foodPreferences: PreferenceItem[];
  winePreferences: PreferenceItem[];
  cocktailPreferences: PreferenceItem[];
  spiritsPreferences: PreferenceItem[];
  allergies: string[];
  importantDates: ImportantDate[];
  connections: Connection[];
  notes: string;
  importantNotables: string[];
}

export const useGuestForm = () => {
  const [formData, setFormData] = useState<GuestFormData>({
    name: '',
    email: '',
    phone: '',
    tags: [],
    tablePreferences: [],
    foodPreferences: [],
    winePreferences: [],
    cocktailPreferences: [],
    spiritsPreferences: [],
    allergies: [],
    importantDates: [],
    connections: [],
    notes: '',
    importantNotables: [],
  });

  const updateField = <K extends keyof GuestFormData>(
    field: K,
    value: GuestFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      tags: [],
      tablePreferences: [],
      foodPreferences: [],
      winePreferences: [],
      cocktailPreferences: [],
      spiritsPreferences: [],
      allergies: [],
      importantDates: [],
      connections: [],
      notes: '',
      importantNotables: [],
    });
  };

  return {
    formData,
    updateField,
    resetForm,
    setFormData,
  };
};
