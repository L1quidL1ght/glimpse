
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EditGuestActionsProps {
  customer: any;
  onGuestUpdated: () => void;
  onClose: () => void;
}

const EditGuestActions: React.FC<EditGuestActionsProps> = ({
  customer,
  onGuestUpdated,
  onClose
}) => {
  const { toast } = useToast();

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
      onClose();
    } catch (error: any) {
      console.error('Error deleting guest:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete guest",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      className="flex items-center gap-2"
    >
      <Trash2 className="w-4 h-4" />
      Delete Guest
    </Button>
  );
};

export default EditGuestActions;
