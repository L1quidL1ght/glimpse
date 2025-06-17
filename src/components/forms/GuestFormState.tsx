
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
  memberId: string;
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

const getInitialFormData = (initialData?: any): GuestFormData => {
  if (initialData) {
    return {
      name: initialData.name || '',
      email: initialData.email || '',
      phone: initialData.phone || '',
      memberId: initialData.member_id || '',
      tags: initialData.tags || [],
      tablePreferences: initialData.tablePreferences || [],
      foodPreferences: initialData.foodPreferences || [],
      winePreferences: initialData.winePreferences || [],
      cocktailPreferences: initialData.cocktailPreferences || [],
      spiritsPreferences: initialData.spiritsPreferences || [],
      allergies: initialData.allergies || [],
      importantDates: initialData.importantDates || [],
      connections: initialData.connections || [],
      notes: initialData.notes || '',
      importantNotables: initialData.importantNotables || [],
    };
  }

  return {
    name: '',
    email: '',
    phone: '',
    memberId: '',
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
  };
};

export const useGuestFormState = (initialData?: any) => {
  const [formData, setFormData] = useState<GuestFormData>(() => getInitialFormData(initialData));

  const updateField = <K extends keyof GuestFormData>(
    field: K,
    value: GuestFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(getInitialFormData());
  };

  return {
    formData,
    updateField,
    resetForm,
    setFormData,
  };
};
