
import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import GuestListItem from '@/components/GuestListItem';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface GuestListProps {
  customers: any[];
  onCustomerSelect: (customer: any) => void;
  onCustomerDeleted?: () => void;
}

const GuestList: React.FC<GuestListProps> = ({
  customers,
  onCustomerSelect,
  onCustomerDeleted
}) => {
  const [deleteCustomer, setDeleteCustomer] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const handleDeleteCustomer = async () => {
    if (!deleteCustomer) return;
    setDeleting(true);
    try {
      // Delete all related data first (due to foreign key constraints)
      await supabase.from('customer_tags').delete().eq('customer_id', deleteCustomer.id);
      await supabase.from('table_preferences').delete().eq('customer_id', deleteCustomer.id);
      await supabase.from('food_preferences').delete().eq('customer_id', deleteCustomer.id);
      await supabase.from('wine_preferences').delete().eq('customer_id', deleteCustomer.id);
      await supabase.from('cocktail_preferences').delete().eq('customer_id', deleteCustomer.id);
      await supabase.from('spirits_preferences').delete().eq('customer_id', deleteCustomer.id);
      await supabase.from('allergies').delete().eq('customer_id', deleteCustomer.id);
      await supabase.from('important_dates').delete().eq('customer_id', deleteCustomer.id);
      await supabase.from('important_notables').delete().eq('customer_id', deleteCustomer.id);
      await supabase.from('customer_notes').delete().eq('customer_id', deleteCustomer.id);
      await supabase.from('connections').delete().eq('customer_id', deleteCustomer.id);
      await supabase.from('connections').delete().eq('connected_customer_id', deleteCustomer.id);

      // Delete visits and visit orders
      const { data: visits } = await supabase.from('visits').select('id').eq('customer_id', deleteCustomer.id);
      if (visits) {
        for (const visit of visits) {
          await supabase.from('visit_orders').delete().eq('visit_id', visit.id);
        }
        await supabase.from('visits').delete().eq('customer_id', deleteCustomer.id);
      }

      // Finally delete the customer
      const { error } = await supabase.from('customers').delete().eq('id', deleteCustomer.id);
      if (error) throw error;

      toast({
        title: "Success",
        description: `${deleteCustomer.name} has been deleted successfully`
      });
      onCustomerDeleted?.();
      setDeleteCustomer(null);
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: "Error",
        description: "Failed to delete customer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };

  if (customers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">No guests found</div>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {customers.map(customer => (
          <div key={customer.id} className="relative group">
            <GuestListItem 
              customer={customer} 
              onClick={() => onCustomerSelect(customer)} 
            />
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                setDeleteCustomer(customer);
              }}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity px-[10px] mx-[50px] my-[15px]"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <AlertDialog open={!!deleteCustomer} onOpenChange={() => setDeleteCustomer(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Guest</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteCustomer?.name}</strong>? 
              This action cannot be undone and will remove all associated data including 
              preferences, visits, and notes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCustomer} 
              disabled={deleting} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete Guest'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default GuestList;
