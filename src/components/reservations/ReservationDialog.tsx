
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useReservations, type Reservation } from '@/hooks/useReservations';
import CustomerAutocomplete from '@/components/forms/CustomerAutocomplete';

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
  const [formData, setFormData] = useState({
    customer_id: '',
    reservation_date: '',
    reservation_time: '',
    party_size: 2,
    table_preference: '',
    special_requests: '',
    status: 'confirmed' as 'confirmed' | 'cancelled' | 'completed' | 'no_show'
  });

  useEffect(() => {
    if (reservation) {
      setFormData({
        customer_id: reservation.customer_id,
        reservation_date: reservation.reservation_date,
        reservation_time: reservation.reservation_time,
        party_size: reservation.party_size,
        table_preference: reservation.table_preference || '',
        special_requests: reservation.special_requests || '',
        status: reservation.status
      });
    } else {
      setFormData({
        customer_id: '',
        reservation_date: '',
        reservation_time: '',
        party_size: 2,
        table_preference: '',
        special_requests: '',
        status: 'confirmed'
      });
    }
  }, [reservation, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customer_id || !formData.reservation_date || !formData.reservation_time) {
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

  const handleCustomerSelect = (customerId: string) => {
    setFormData(prev => ({ ...prev, customer_id: customerId }));
  };

  const handleStatusChange = (status: string) => {
    setFormData(prev => ({ 
      ...prev, 
      status: status as 'confirmed' | 'cancelled' | 'completed' | 'no_show'
    }));
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
          <div className="space-y-2">
            <Label>Customer *</Label>
            <CustomerAutocomplete
              value={formData.customer_id}
              onSelect={handleCustomerSelect}
              placeholder="Search for a customer..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.reservation_date}
                onChange={(e) => setFormData(prev => ({ ...prev, reservation_date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.reservation_time}
                onChange={(e) => setFormData(prev => ({ ...prev, reservation_time: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="party_size">Party Size</Label>
              <Input
                id="party_size"
                type="number"
                min="1"
                max="20"
                value={formData.party_size}
                onChange={(e) => setFormData(prev => ({ ...prev, party_size: parseInt(e.target.value) || 1 }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="no_show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="table_preference">Table Preference</Label>
            <Input
              id="table_preference"
              value={formData.table_preference}
              onChange={(e) => setFormData(prev => ({ ...prev, table_preference: e.target.value }))}
              placeholder="e.g., Window table, Booth, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="special_requests">Special Requests</Label>
            <Textarea
              id="special_requests"
              value={formData.special_requests}
              onChange={(e) => setFormData(prev => ({ ...prev, special_requests: e.target.value }))}
              placeholder="Any special requests or notes..."
              rows={3}
            />
          </div>

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
              disabled={loading || !formData.customer_id || !formData.reservation_date || !formData.reservation_time}
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
