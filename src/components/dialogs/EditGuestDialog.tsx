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

      // Delete and recreate tags
      await supabase.from('customer_tags').delete().eq('customer_id', customer.id);
      if (formData.tags.length > 0) {
        const { error: tagsError } = await supabase
          .from('customer_tags')
          .insert(formData.tags.map(tag => ({
            customer_id: customer.id,
            tag_name: tag
          })));
        if (tagsError) throw tagsError;
      }

      // Delete and recreate table preferences
      await supabase.from('table_preferences').delete().eq('customer_id', customer.id);
      if (formData.tablePreferences.length > 0) {
        const { error: tablePreferencesError } = await supabase
          .from('table_preferences')
          .insert(formData.tablePreferences.map(pref => ({
            customer_id: customer.id,
            preference: pref
          })));
        if (tablePreferencesError) throw tablePreferencesError;
      }

      // Delete and recreate allergies
      await supabase.from('allergies').delete().eq('customer_id', customer.id);
      if (formData.allergies.length > 0) {
        const { error: allergiesError } = await supabase
          .from('allergies')
          .insert(formData.allergies.map(allergy => ({
            customer_id: customer.id,
            allergy: allergy
          })));
        if (allergiesError) throw allergiesError;
      }

      // Delete and recreate important notables
      await supabase.from('important_notables').delete().eq('customer_id', customer.id);
      if (formData.importantNotables.length > 0) {
        const { error: importantNotablesError } = await supabase
          .from('important_notables')
          .insert(formData.importantNotables.map(notable => ({
            customer_id: customer.id,
            notable: notable
          })));
        if (importantNotablesError) throw importantNotablesError;
      }

      // Handle connections (more complex as it requires customer lookups)
      await supabase.from('connections').delete().eq('customer_id', customer.id);
      for (const connection of connections) {
        const { data: connectedCustomer } = await supabase
          .from('customers')
          .select('id')
          .eq('name', connection.name)
          .single();
        
        if (connectedCustomer) {
          const { error: connectionError } = await supabase
            .from('connections')
            .insert({
              customer_id: customer.id,
              connected_customer_id: connectedCustomer.id,
              relationship: connection.relationship
            });
          if (connectionError) throw connectionError;
        }
      }

      // Delete and recreate important dates
      await supabase.from('important_dates').delete().eq('customer_id', customer.id);
      if (importantDates.length > 0) {
        const { error: importantDatesError } = await supabase
          .from('important_dates')
          .insert(importantDates.map(date => ({
            customer_id: customer.id,
            event: date.event,
            date: date.date
          })));
        if (importantDatesError) throw importantDatesError;
      }

      // Update preferences
      const preferenceCategories = [
        { category: 'food_preferences', data: preferences.food },
        { category: 'wine_preferences', data: preferences.wine },
        { category: 'cocktail_preferences', data: preferences.cocktail },
        { category: 'spirits_preferences', data: preferences.spirits }
      ];

      for (const { category, data } of preferenceCategories) {
        await supabase.from(category).delete().eq('customer_id', customer.id);
        if (data.length > 0) {
          const { error } = await supabase
            .from(category)
            .insert(data.map(pref => ({
              customer_id: customer.id,
              preference: pref,
              is_golden: false
            })));
          if (error) throw error;
        }
      }

      // Update or create customer notes
      const { error: notesError } = await supabase
        .from('customer_notes')
        .upsert({
          customer_id: customer.id,
          note: formData.notes,
          updated_at: new Date().toISOString()
        });
      if (notesError) throw notesError;

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
