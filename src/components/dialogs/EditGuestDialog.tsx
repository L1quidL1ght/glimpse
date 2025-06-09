
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import GuestFormFields from '@/components/forms/GuestFormFields';
import PreferencesSections from '@/components/forms/PreferencesSections';
import { useGuestForm } from '@/hooks/useGuestForm';

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
  const { formData, updateField, resetForm } = useGuestForm();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Populate form with existing customer data
  useEffect(() => {
    if (customer && open) {
      updateField('name', customer.name || '');
      updateField('email', customer.email || '');
      updateField('phone', customer.phone || '');
      updateField('tags', customer.tags || []);
      updateField('tablePreferences', customer.tablePreferences || []);
      updateField('foodPreferences', customer.foodPreferences || []);
      updateField('winePreferences', customer.winePreferences || []);
      updateField('cocktailPreferences', customer.cocktailPreferences || []);
      updateField('spiritsPreferences', customer.spiritsPreferences || []);
      updateField('allergies', customer.allergies || []);
      updateField('importantDates', customer.importantDates || []);
      updateField('connections', customer.connections || []);
      updateField('notes', customer.notes || '');
      updateField('importantNotables', customer.importantNotables || []);
    }
  }, [customer, open]);

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

    setIsSubmitting(true);

    try {
      // Update customer basic info
      const { error: customerError } = await supabase
        .from('customers')
        .update({
          name: formData.name.trim(),
          email: formData.email.trim() || null,
          phone: formData.phone.trim() || null,
        })
        .eq('id', customer.id);

      if (customerError) throw customerError;

      // Delete existing related data and re-insert
      await supabase.from('customer_tags').delete().eq('customer_id', customer.id);
      await supabase.from('table_preferences').delete().eq('customer_id', customer.id);
      await supabase.from('food_preferences').delete().eq('customer_id', customer.id);
      await supabase.from('wine_preferences').delete().eq('customer_id', customer.id);
      await supabase.from('cocktail_preferences').delete().eq('customer_id', customer.id);
      await supabase.from('spirits_preferences').delete().eq('customer_id', customer.id);
      await supabase.from('allergies').delete().eq('customer_id', customer.id);
      await supabase.from('important_dates').delete().eq('customer_id', customer.id);
      await supabase.from('important_notables').delete().eq('customer_id', customer.id);
      await supabase.from('customer_notes').delete().eq('customer_id', customer.id);
      await supabase.from('connections').delete().eq('customer_id', customer.id);

      // Re-insert all the data (same logic as AddGuestDialog)
      if (formData.tags.length > 0) {
        const tagInserts = formData.tags.map(tag => ({
          customer_id: customer.id,
          tag_name: tag
        }));
        await supabase.from('customer_tags').insert(tagInserts);
      }

      if (formData.tablePreferences.length > 0) {
        const tablePrefs = formData.tablePreferences.map(pref => ({
          customer_id: customer.id,
          preference: pref
        }));
        await supabase.from('table_preferences').insert(tablePrefs);
      }

      if (formData.foodPreferences.length > 0) {
        const foodPrefs = formData.foodPreferences.map(pref => ({
          customer_id: customer.id,
          preference: pref.value,
          is_golden: pref.isGolden
        }));
        await supabase.from('food_preferences').insert(foodPrefs);
      }

      if (formData.winePreferences.length > 0) {
        const winePrefs = formData.winePreferences.map(pref => ({
          customer_id: customer.id,
          preference: pref.value,
          is_golden: pref.isGolden
        }));
        await supabase.from('wine_preferences').insert(winePrefs);
      }

      if (formData.cocktailPreferences.length > 0) {
        const cocktailPrefs = formData.cocktailPreferences.map(pref => ({
          customer_id: customer.id,
          preference: pref.value,
          is_golden: pref.isGolden
        }));
        await supabase.from('cocktail_preferences').insert(cocktailPrefs);
      }

      if (formData.spiritsPreferences.length > 0) {
        const spiritsPrefs = formData.spiritsPreferences.map(pref => ({
          customer_id: customer.id,
          preference: pref.value,
          is_golden: pref.isGolden
        }));
        await supabase.from('spirits_preferences').insert(spiritsPrefs);
      }

      if (formData.allergies.length > 0) {
        const allergyInserts = formData.allergies.map(allergy => ({
          customer_id: customer.id,
          allergy: allergy
        }));
        await supabase.from('allergies').insert(allergyInserts);
      }

      if (formData.importantDates.length > 0) {
        const dateInserts = formData.importantDates.map(dateItem => ({
          customer_id: customer.id,
          event: dateItem.event,
          date: dateItem.date
        }));
        await supabase.from('important_dates').insert(dateInserts);
      }

      if (formData.importantNotables.length > 0) {
        const notableInserts = formData.importantNotables.map(notable => ({
          customer_id: customer.id,
          notable: notable
        }));
        await supabase.from('important_notables').insert(notableInserts);
      }

      if (formData.notes.trim()) {
        await supabase.from('customer_notes').insert({
          customer_id: customer.id,
          note: formData.notes.trim()
        });
      }

      if (formData.connections.length > 0) {
        for (const connection of formData.connections) {
          const { data: connectedCustomer } = await supabase
            .from('customers')
            .select('id')
            .eq('name', connection.name)
            .single();

          if (connectedCustomer) {
            await supabase.from('connections').insert({
              customer_id: customer.id,
              connected_customer_id: connectedCustomer.id,
              relationship: connection.relationship
            });
          }
        }
      }

      resetForm();
      onGuestUpdated();
      onOpenChange(false);
      
      toast({
        title: "Success",
        description: "Guest updated successfully!",
      });
    } catch (error) {
      console.error('Error updating guest:', error);
      toast({
        title: "Error",
        description: "Failed to update guest. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Guest</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <GuestFormFields formData={formData} updateField={updateField} />
            <PreferencesSections formData={formData} updateField={updateField} />
            
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.name.trim()}
                className="flex-1"
              >
                {isSubmitting ? 'Updating...' : 'Update Guest'}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditGuestDialog;
