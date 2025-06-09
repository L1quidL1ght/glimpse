
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import EditGuestFormContainer from '@/components/forms/EditGuestFormContainer';
import EditGuestActions from '@/components/forms/EditGuestActions';

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
          <div className="flex items-center justify-between">
            <DialogTitle>Edit Guest</DialogTitle>
            <EditGuestActions
              customer={customer}
              onGuestUpdated={handleGuestUpdated}
              onClose={() => onOpenChange(false)}
            />
          </div>
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
