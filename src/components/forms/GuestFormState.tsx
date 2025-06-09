
import { useState, useEffect } from 'react';
import { GuestFormData } from '@/hooks/useGuestForm';

interface GuestFormStateProps {
  customer: any;
  open: boolean;
  setFormData: (data: GuestFormData) => void;
}

export const useGuestFormState = ({ customer, open, setFormData }: GuestFormStateProps) => {
  const [connections, setConnections] = useState<Array<{ name: string; relationship: string }>>([]);
  const [importantDates, setImportantDates] = useState<Array<{ event: string; date: string }>>([]);
  const [preferences, setPreferences] = useState({
    food: [] as string[],
    wine: [] as string[],
    cocktail: [] as string[],
    spirits: [] as string[]
  });

  useEffect(() => {
    if (customer && open) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        tags: customer.tags || [],
        tablePreferences: customer.tablePreferences || [],
        foodPreferences: customer.foodPreferences || [],
        winePreferences: customer.winePreferences || [],
        cocktailPreferences: customer.cocktailPreferences || [],
        spiritsPreferences: customer.spiritsPreferences || [],
        allergies: customer.allergies || [],
        importantDates: customer.importantDates || [],
        connections: customer.connections || [],
        notes: customer.notes || '',
        importantNotables: customer.importantNotables || []
      });

      setConnections(customer.connections || []);
      setImportantDates(customer.importantDates || []);
      setPreferences({
        food: customer.foodPreferences?.map((p: any) => p.value) || [],
        wine: customer.winePreferences?.map((p: any) => p.value) || [],
        cocktail: customer.cocktailPreferences?.map((p: any) => p.value) || [],
        spirits: customer.spiritsPreferences?.map((p: any) => p.value) || []
      });
    }
  }, [customer, open, setFormData]);

  const handlePreferencesChange = (category: string, newPreferences: string[]) => {
    setPreferences(prev => ({
      ...prev,
      [category]: newPreferences
    }));
  };

  return {
    connections,
    setConnections,
    importantDates,
    setImportantDates,
    preferences,
    handlePreferencesChange
  };
};
