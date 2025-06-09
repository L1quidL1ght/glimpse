
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
