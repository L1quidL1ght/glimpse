
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trash2, User } from 'lucide-react';

interface DuplicateGroup {
  phone: string;
  customers: Array<{
    id: string;
    name: string;
    email: string | null;
    created_at: string;
  }>;
}

interface DuplicatePhoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResolved: () => void;
}

const DuplicatePhoneDialog: React.FC<DuplicatePhoneDialogProps> = ({
  open,
  onOpenChange,
  onResolved
}) => {
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchDuplicates();
    }
  }, [open]);

  const fetchDuplicates = async () => {
    try {
      setLoading(true);
      
      // Find phone numbers that appear more than once
      const { data: phoneGroups, error } = await supabase
        .from('customers')
        .select('phone, id, name, email, created_at')
        .not('phone', 'is', null)
        .order('phone', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group by phone number and filter duplicates
      const phoneMap = new Map<string, typeof phoneGroups>();
      phoneGroups.forEach(customer => {
        if (!phoneMap.has(customer.phone!)) {
          phoneMap.set(customer.phone!, []);
        }
        phoneMap.get(customer.phone!)!.push(customer);
      });

      const duplicateGroups: DuplicateGroup[] = [];
      phoneMap.forEach((customers, phone) => {
        if (customers.length > 1) {
          duplicateGroups.push({ phone, customers });
        }
      });

      setDuplicates(duplicateGroups);
    } catch (error) {
      console.error('Error fetching duplicates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch duplicate phone numbers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeCustomer = async (customerId: string, phone: string) => {
    try {
      setResolving(true);
      
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Customer removed successfully",
      });

      // Refresh duplicates
      await fetchDuplicates();
    } catch (error) {
      console.error('Error removing customer:', error);
      toast({
        title: "Error",
        description: "Failed to remove customer",
        variant: "destructive",
      });
    } finally {
      setResolving(false);
    }
  };

  const clearPhone = async (customerId: string, phone: string) => {
    try {
      setResolving(true);
      
      const { error } = await supabase
        .from('customers')
        .update({ phone: null })
        .eq('id', customerId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Phone number cleared successfully",
      });

      // Refresh duplicates
      await fetchDuplicates();
    } catch (error) {
      console.error('Error clearing phone:', error);
      toast({
        title: "Error",
        description: "Failed to clear phone number",
        variant: "destructive",
      });
    } finally {
      setResolving(false);
    }
  };

  const handleClose = () => {
    if (duplicates.length === 0) {
      onResolved();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Resolve Duplicate Phone Numbers</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">Loading duplicate phone numbers...</div>
          ) : duplicates.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-green-600 font-medium">No duplicate phone numbers found!</div>
              <p className="text-muted-foreground mt-2">You can now proceed with adding the unique constraint.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-sm text-muted-foreground">
                Found {duplicates.length} phone number(s) with duplicates. Please resolve these before proceeding:
              </div>
              
              {duplicates.map(({ phone, customers }) => (
                <Card key={phone}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge variant="destructive">{phone}</Badge>
                      <span className="text-sm font-normal text-muted-foreground">
                        ({customers.length} customers)
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {customers.map((customer) => (
                        <div key={customer.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {customer.email || 'No email'} • Created {new Date(customer.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => clearPhone(customer.id, phone)}
                              disabled={resolving}
                            >
                              Clear Phone
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeCustomer(customer.id, phone)}
                              disabled={resolving}
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove Customer
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleClose}>
            {duplicates.length === 0 ? 'Continue' : 'Close'}
          </Button>
          {duplicates.length === 0 && (
            <Button onClick={onResolved}>
              Apply Unique Constraint
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicatePhoneDialog;
