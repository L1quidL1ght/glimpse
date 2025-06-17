
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import EditGuestFormContainer from '@/components/forms/EditGuestFormContainer';

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
  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleGuestUpdated = () => {
    onGuestUpdated();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Guest</DialogTitle>
        </DialogHeader>

        <EditGuestFormContainer
          customer={customer}
          open={open}
          onGuestUpdated={handleGuestUpdated}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditGuestDialog;
