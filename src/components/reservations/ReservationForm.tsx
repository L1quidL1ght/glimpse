
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CustomerAutocomplete from '@/components/forms/CustomerAutocomplete';
import NewCustomerDialog from './NewCustomerDialog';
import { useRestaurantTables } from '@/hooks/useRestaurantTables';

interface ReservationFormData {
  customer_id: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  section: string;
  table_id: string;
  special_requests: string;
}

interface ReservationFormProps {
  formData: ReservationFormData;
  onUpdateField: (field: keyof ReservationFormData, value: any) => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
  formData,
  onUpdateField
}) => {
  const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false);
  const { tables, loading, getTablesBySection, getSections } = useRestaurantTables();

  const handleCustomerSelect = (customerId: string) => {
    onUpdateField('customer_id', customerId);
  };

  const handleNewCustomerCreated = (customerId: string) => {
    onUpdateField('customer_id', customerId);
  };

  const handleSectionChange = (section: string) => {
    onUpdateField('section', section);
    // Reset table selection when section changes
    onUpdateField('table_id', '');
  };

  const availableTables = formData.section ? getTablesBySection(formData.section) : [];
  const sections = getSections();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Customer *</Label>
        <div className="flex gap-2">
          <div className="flex-1">
            <CustomerAutocomplete
              value={formData.customer_id}
              onSelect={handleCustomerSelect}
              placeholder="Search for a customer..."
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setShowNewCustomerDialog(true)}
            title="Add new customer"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
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
          <Label htmlFor="section">Section *</Label>
          <Select value={formData.section} onValueChange={handleSectionChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              {sections.map((section) => (
                <SelectItem key={section} value={section}>
                  {section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="table_id">Select Table</Label>
        <Select 
          value={formData.table_id} 
          onValueChange={(value) => onUpdateField('table_id', value)}
          disabled={!formData.section || loading}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              !formData.section 
                ? "Select a section first" 
                : availableTables.length === 0 
                  ? "No tables available" 
                  : "Select table (optional)"
            } />
          </SelectTrigger>
          <SelectContent>
            {availableTables.map((table) => (
              <SelectItem key={table.id} value={table.id}>
                {table.name} (Seats {table.capacity})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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

      <NewCustomerDialog
        open={showNewCustomerDialog}
        onOpenChange={setShowNewCustomerDialog}
        onCustomerCreated={handleNewCustomerCreated}
      />
    </div>
  );
};

export default ReservationForm;
