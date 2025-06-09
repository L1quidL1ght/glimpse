
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import GuestFormContainer from '@/components/forms/GuestFormContainer';

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add New Guest</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <GuestFormContainer
            mode="create"
            onSuccess={() => {
              onGuestAdded();
              onOpenChange(false);
            }}
            onCancel={() => onOpenChange(false)}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddGuestDialog;
