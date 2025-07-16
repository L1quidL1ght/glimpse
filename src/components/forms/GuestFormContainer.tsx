
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ExtendedGuestFormFields from './ExtendedGuestFormFields';
import { useGuestForm } from '@/hooks/useGuestForm';
import { useGuestFormSubmission } from '@/hooks/useGuestFormSubmission';

interface GuestFormContainerProps {
  mode: 'create' | 'edit';
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const GuestFormContainer: React.FC<GuestFormContainerProps> = ({
  mode,
  initialData,
  onSuccess,
  onCancel
}) => {
  const { toast } = useToast();
  const { formData, updateField, resetForm } = useGuestForm(initialData);
  const { submitForm, isSubmitting } = useGuestFormSubmission();

  // Additional state for extended form fields
  const [connections, setConnections] = useState<Array<{ name: string; relationship: string }>>(
    initialData?.connections || []
  );
  const [importantDates, setImportantDates] = useState<Array<{ event: string; date: string }>>(
    initialData?.importantDates || []
  );
  const [preferences, setPreferences] = useState({
    food: initialData?.foodPreferences?.map((p: any) => p.value) || [],
    wine: initialData?.winePreferences?.map((p: any) => p.value) || [],
    cocktail: initialData?.cocktailPreferences?.map((p: any) => p.value) || [],
    spirits: initialData?.spiritsPreferences?.map((p: any) => p.value) || [],
  });

  console.log('GuestFormContainer formData:', formData);

  const handlePreferencesChange = (category: string, newPreferences: string[]) => {
    setPreferences(prev => ({
      ...prev,
      [category]: newPreferences
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only validate that name is provided - all other fields are optional
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Guest name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update formData with connections and important dates
      const updatedFormData = {
        ...formData,
        connections,
        importantDates
      };
      
      await submitForm(updatedFormData, mode === 'edit' ? initialData?.id : undefined);
      
      if (mode === 'create') {
        resetForm();
      }
      
      onSuccess();
      
      toast({
        title: "Success",
        description: `Guest ${mode === 'edit' ? 'updated' : 'added'} successfully!`,
      });
    } catch (error) {
      console.error(`Error ${mode === 'edit' ? 'updating' : 'adding'} guest:`, error);
      toast({
        title: "Error",
        description: `Failed to ${mode === 'edit' ? 'update' : 'add'} guest. Please try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ExtendedGuestFormFields
        formData={formData}
        updateField={updateField}
        customerId={mode === 'edit' ? initialData?.id : undefined}
        connections={connections}
        importantDates={importantDates}
        onConnectionsChange={setConnections}
        onImportantDatesChange={setImportantDates}
        preferences={preferences}
        onPreferencesChange={handlePreferencesChange}
      />
      
      <div className="flex gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !formData.name.trim()}
          className="flex-1"
        >
          {isSubmitting 
            ? (mode === 'edit' ? 'Updating...' : 'Adding...') 
            : (mode === 'edit' ? 'Update Guest' : 'Add Guest')
          }
        </Button>
      </div>
    </form>
  );
};

export default GuestFormContainer;
