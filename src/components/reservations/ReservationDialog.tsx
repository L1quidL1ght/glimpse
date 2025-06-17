
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useReservations, type Reservation } from '@/hooks/useReservations';
import { useReservationForm } from '@/hooks/useReservationForm';
import ReservationForm from './ReservationForm';

interface ReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation?: Reservation | null;
}

const ReservationDialog: React.FC<ReservationDialogProps> = ({
  open,
  onOpenChange,
  reservation
}) => {
  const { createReservation, updateReservation } = useReservations();
  const [loading, setLoading] = useState(false);
  const { formData, updateField, isFormValid } = useReservationForm(reservation);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      return;
    }

    try {
      setLoading(true);
      
      if (reservation) {
        await updateReservation(reservation.id, formData);
      } else {
        await createReservation(formData);
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving reservation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {reservation ? 'Edit Reservation' : 'New Reservation'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ReservationForm
            formData={formData}
            onUpdateField={updateField}
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
              disabled={loading || !isFormValid()}
              className="flex-1"
            >
              {loading ? 'Saving...' : reservation ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationDialog;
