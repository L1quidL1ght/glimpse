import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import GuestFormFields from '@/components/forms/GuestFormFields';
import PreferencesSections from '@/components/forms/PreferencesSections';
import { useGuestForm } from '@/hooks/useGuestForm';

interface AddGuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGuestAdded: () => void;
}

const AddGuestDialog: React.FC<AddGuestDialogProps> = ({
  open,
  onOpenChange,
  onGuestAdded
}) => {
  const { toast } = useToast();
  const { formData, updateField, resetForm } = useGuestForm();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Dummy preferences state for compatibility
  const preferences = {
    food: [],
    wine: [],
    cocktail: [],
    spirits: []
  };

  const handlePreferencesChange = (category: string, newPreferences: string[]) => {
    // This is a dummy function for compatibility - preferences are handled directly in the form
    console.log('Preferences changed:', category, newPreferences);
  };

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
      // Insert customer
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim() || null,
          phone: formData.phone.trim() || null,
        })
        .select()
        .single();

      if (customerError) throw customerError;

      // Insert tags
      if (formData.tags.length > 0) {
        const tagInserts = formData.tags.map(tag => ({
          customer_id: customer.id,
          tag_name: tag
        }));

        const { error: tagsError } = await supabase
          .from('customer_tags')
          .insert(tagInserts);

        if (tagsError) throw tagsError;
      }

      // Insert table preferences
      if (formData.tablePreferences.length > 0) {
        const tablePrefs = formData.tablePreferences.map(pref => ({
          customer_id: customer.id,
          preference: pref
        }));

        const { error: tablePrefError } = await supabase
          .from('table_preferences')
          .insert(tablePrefs);

        if (tablePrefError) throw tablePrefError;
      }

      // Insert food preferences
      if (formData.foodPreferences.length > 0) {
        const foodPrefs = formData.foodPreferences.map(pref => ({
          customer_id: customer.id,
          preference: pref.value,
          is_golden: pref.isGolden
        }));

        const { error: foodPrefError } = await supabase
          .from('food_preferences')
          .insert(foodPrefs);

        if (foodPrefError) throw foodPrefError;

        // Update preference options for autocomplete
        for (const pref of formData.foodPreferences) {
          await supabase.rpc('upsert_preference_option', {
            p_category: 'food',
            p_preference_text: pref.value
          });
        }
      }

      // Insert wine preferences
      if (formData.winePreferences.length > 0) {
        const winePrefs = formData.winePreferences.map(pref => ({
          customer_id: customer.id,
          preference: pref.value,
          is_golden: pref.isGolden
        }));

        const { error: winePrefError } = await supabase
          .from('wine_preferences')
          .insert(winePrefs);

        if (winePrefError) throw winePrefError;

        // Update preference options for autocomplete
        for (const pref of formData.winePreferences) {
          await supabase.rpc('upsert_preference_option', {
            p_category: 'wine',
            p_preference_text: pref.value
          });
        }
      }

      // Insert cocktail preferences
      if (formData.cocktailPreferences.length > 0) {
        const cocktailPrefs = formData.cocktailPreferences.map(pref => ({
          customer_id: customer.id,
          preference: pref.value,
          is_golden: pref.isGolden
        }));

        const { error: cocktailPrefError } = await supabase
          .from('cocktail_preferences')
          .insert(cocktailPrefs);

        if (cocktailPrefError) throw cocktailPrefError;

        // Update preference options for autocomplete
        for (const pref of formData.cocktailPreferences) {
          await supabase.rpc('upsert_preference_option', {
            p_category: 'cocktail',
            p_preference_text: pref.value
          });
        }
      }

      // Insert spirits preferences
      if (formData.spiritsPreferences.length > 0) {
        const spiritsPrefs = formData.spiritsPreferences.map(pref => ({
          customer_id: customer.id,
          preference: pref.value,
          is_golden: pref.isGolden
        }));

        const { error: spiritsPrefError } = await supabase
          .from('spirits_preferences')
          .insert(spiritsPrefs);

        if (spiritsPrefError) throw spiritsPrefError;

        // Update preference options for autocomplete
        for (const pref of formData.spiritsPreferences) {
          await supabase.rpc('upsert_preference_option', {
            p_category: 'spirits',
            p_preference_text: pref.value
          });
        }
      }

      // Insert allergies
      if (formData.allergies.length > 0) {
        const allergyInserts = formData.allergies.map(allergy => ({
          customer_id: customer.id,
          allergy: allergy
        }));

        const { error: allergiesError } = await supabase
          .from('allergies')
          .insert(allergyInserts);

        if (allergiesError) throw allergiesError;
      }

      // Insert important dates
      if (formData.importantDates.length > 0) {
        const dateInserts = formData.importantDates.map(dateItem => ({
          customer_id: customer.id,
          event: dateItem.event,
          date: dateItem.date
        }));

        const { error: datesError } = await supabase
          .from('important_dates')
          .insert(dateInserts);

        if (datesError) throw datesError;
      }

      // Insert important notables
      if (formData.importantNotables.length > 0) {
        const notableInserts = formData.importantNotables.map(notable => ({
          customer_id: customer.id,
          notable: notable
        }));

        const { error: notablesError } = await supabase
          .from('important_notables')
          .insert(notableInserts);

        if (notablesError) throw notablesError;
      }

      // Insert notes
      if (formData.notes.trim()) {
        const { error: notesError } = await supabase
          .from('customer_notes')
          .insert({
            customer_id: customer.id,
            note: formData.notes.trim()
          });

        if (notesError) throw notesError;
      }

      // Handle connections
      if (formData.connections.length > 0) {
        for (const connection of formData.connections) {
          // Find the connected customer by name
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
      }

      console.log('Guest added successfully:', customer);
      
      resetForm();
      onGuestAdded();
      onOpenChange(false);
      
      toast({
        title: "Success",
        description: "Guest added successfully!",
      });
    } catch (error) {
      console.error('Error adding guest:', error);
      toast({
        title: "Error",
        description: "Failed to add guest. Please try again.",
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
          <DialogTitle>Add New Guest</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <GuestFormFields formData={formData} updateField={updateField} />
            <PreferencesSections 
              formData={formData} 
              updateField={updateField}
              preferences={preferences}
              onPreferencesChange={handlePreferencesChange}
            />
            
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
                {isSubmitting ? 'Adding...' : 'Add Guest'}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddGuestDialog;
