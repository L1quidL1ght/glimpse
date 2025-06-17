
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NewCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomerCreated: (customerId: string) => void;
}

const NewCustomerDialog: React.FC<NewCustomerDialogProps> = ({
  open,
  onOpenChange,
  onCustomerCreated
}) => {
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerData.name.trim()) {
      toast({
        title: "Error",
        description: "Customer name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreating(true);
      
      const { data, error } = await supabase
        .from('customers')
        .insert({
          name: customerData.name.trim(),
          email: customerData.email.trim() || null,
          phone: customerData.phone.trim() || null,
        })
        .select()
        .single();

      if (error) throw error;

      onCustomerCreated(data.id);
      setCustomerData({ name: '', email: '', phone: '' });
      onOpenChange(false);
      
      toast({
        title: "Success",
        description: "New customer added successfully",
      });
    } catch (error) {
      console.error('Error creating customer:', error);
      toast({
        title: "Error",
        description: "Failed to create customer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setCustomerData({ name: '', email: '', phone: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={customerData.name}
              onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter customer name..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={customerData.email}
              onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={customerData.phone}
              onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter phone number..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || !customerData.name.trim()}
              className="flex-1"
            >
              {isCreating ? 'Adding...' : 'Add Customer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewCustomerDialog;
