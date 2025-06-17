
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CustomerAutocomplete from '@/components/forms/CustomerAutocomplete';

interface ReservationFormData {
  customer_id: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  table_preference: string;
  special_requests: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
}

interface ReservationFormProps {
  formData: ReservationFormData;
  onUpdateField: (field: keyof ReservationFormData, value: any) => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  formData,
  onUpdateField
}) => {
  const handleCustomerSelect = (customerId: string) => {
    onUpdateField('customer_id', customerId);
  };

  const handleStatusChange = (status: string) => {
    onUpdateField('status', status as 'confirmed' | 'cancelled' | 'completed' | 'no_show');
  };

  return (
    <div className="space-y-4">
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
            onChange={(e) => onUpdateField('reservation_date', e.target.value)}
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
            onChange={(e) => onUpdateField('reservation_time', e.target.value)}
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
            onChange={(e) => onUpdateField('party_size', parseInt(e.target.value) || 1)}
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
          onChange={(e) => onUpdateField('table_preference', e.target.value)}
          placeholder="e.g., Window table, Booth, etc."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="special_requests">Special Requests</Label>
        <Textarea
          id="special_requests"
          value={formData.special_requests}
          onChange={(e) => onUpdateField('special_requests', e.target.value)}
          placeholder="Any special requests or notes..."
          rows={3}
        />
      </div>
    </div>
  );
};

export default ReservationForm;
