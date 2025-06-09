
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import GuestFormFields from './GuestFormFields';
import PreferencesSections from './PreferencesSections';
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

  console.log('GuestFormContainer formData:', formData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Guest name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await submitForm(formData, mode === 'edit' ? initialData?.id : undefined);
      
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
      <GuestFormFields formData={formData} updateField={updateField} />
      <PreferencesSections 
        formData={formData} 
        updateField={updateField}
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
