import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useGuestForm } from '@/hooks/useGuestForm';
import { useCustomerAutocomplete } from '@/hooks/useCustomerAutocomplete';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ExtendedGuestFormFields from '@/components/forms/ExtendedGuestFormFields';

interface EditGuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGuestUpdated: () => void;
  customer: any;
}

const EditGuestDialog: React.FC<EditGuestDialogProps> = ({
  open,
  onOpenChange,
  onGuestUpdated,
  customer
}) => {
  const { toast } = useToast();
  const { customers } = useCustomerAutocomplete();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connections, setConnections] = useState<Array<{ name: string; relationship: string }>>([]);
  const [importantDates, setImportantDates] = useState<Array<{ event: string; date: string }>>([]);
  const [preferences, setPreferences] = useState({
    food: [] as string[],
    wine: [] as string[],
    cocktail: [] as string[],
    spirits: [] as string[]
  });

  const { formData, updateField, resetForm, setFormData } = useGuestForm();

  // Get existing phone numbers excluding current customer
  const existingPhoneNumbers = customers
    .filter(c => c.id !== customer?.id)
    .map(c => c.phone)
    .filter(Boolean) as string[];

  useEffect(() => {
    if (customer && open) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        tags: customer.tags || [],
        tablePreferences: customer.tablePreferences || [],
        allergies: customer.allergies || [],
        importantNotables: customer.importantNotables || []
      });

      setConnections(customer.connections || []);
      setImportantDates(customer.importantDates || []);
      setPreferences({
        food: customer.foodPreferences || [],
        wine: customer.winePreferences || [],
        cocktail: customer.cocktailPreferences || [],
        spirits: customer.spiritsPreferences || []
      });
    }
  }, [customer, open, setFormData]);

  const handlePreferencesChange = (category: string, newPreferences: string[]) => {
    setPreferences(prev => ({
      ...prev,
      [category]: newPreferences
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Guest name is required",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Update customer basic info
      const { error: customerError } = await supabase
        .from('customers')
        .update({
          name: formData.name.trim(),
          email: formData.email?.trim() || null,
          phone: formData.phone?.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', customer.id);

      if (customerError) throw customerError;

      // Handle all the related data updates (tags, preferences, etc.)
      // Update tags
      const { error: tagsError } = await supabase
        .from('customers')
        .update({ tags: formData.tags })
        .eq('id', customer.id);

      if (tagsError) throw tagsError;

      // Update table preferences
      const { error: tablePreferencesError } = await supabase
        .from('customers')
        .update({ tablePreferences: formData.tablePreferences })
        .eq('id', customer.id);

      if (tablePreferencesError) throw tablePreferencesError;

      // Update allergies
      const { error: allergiesError } = await supabase
        .from('customers')
        .update({ allergies: formData.allergies })
        .eq('id', customer.id);

      if (allergiesError) throw allergiesError;

      // Update important notables
      const { error: importantNotablesError } = await supabase
        .from('customers')
        .update({ importantNotables: formData.importantNotables })
        .eq('id', customer.id);

      if (importantNotablesError) throw importantNotablesError;

      // Update connections
      const { error: connectionsError } = await supabase
        .from('customers')
        .update({ connections: connections })
        .eq('id', customer.id);

      if (connectionsError) throw connectionsError;

      // Update important dates
      const { error: importantDatesError } = await supabase
        .from('customers')
        .update({ importantDates: importantDates })
        .eq('id', customer.id);

      if (importantDatesError) throw importantDatesError;

      // Update food preferences
      const { error: foodPreferencesError } = await supabase
        .from('customers')
        .update({ foodPreferences: preferences.food })
        .eq('id', customer.id);

      if (foodPreferencesError) throw foodPreferencesError;

      // Update wine preferences
      const { error: winePreferencesError } = await supabase
        .from('customers')
        .update({ winePreferences: preferences.wine })
        .eq('id', customer.id);

      if (winePreferencesError) throw winePreferencesError;

      // Update cocktail preferences
      const { error: cocktailPreferencesError } = await supabase
        .from('customers')
        .update({ cocktailPreferences: preferences.cocktail })
        .eq('id', customer.id);

      if (cocktailPreferencesError) throw cocktailPreferencesError;

      // Update spirits preferences
      const { error: spiritsPreferencesError } = await supabase
        .from('customers')
        .update({ spiritsPreferences: preferences.spirits })
        .eq('id', customer.id);

      if (spiritsPreferencesError) throw spiritsPreferencesError;

      toast({
        title: "Success",
        description: "Guest updated successfully"
      });

      onGuestUpdated();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating guest:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update guest",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this guest? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customer.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Guest deleted successfully"
      });

      onGuestUpdated();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error deleting guest:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete guest",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Edit Guest</DialogTitle>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Guest
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <ExtendedGuestFormFields
            formData={formData}
            updateField={updateField}
            existingPhoneNumbers={existingPhoneNumbers}
            customerId={customer?.id}
            connections={connections}
            importantDates={importantDates}
            onConnectionsChange={setConnections}
            onImportantDatesChange={setImportantDates}
            preferences={preferences}
            onPreferencesChange={handlePreferencesChange}
          />
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Guest'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditGuestDialog;
