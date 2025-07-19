
import React, { useState } from 'react';
import CompactConnections from '@/components/profile/CompactConnections';
import PreferencesGrid from '@/components/profile/PreferencesGrid';
import SpecialNotes from '@/components/profile/SpecialNotes';
import ImportantDates from '@/components/profile/ImportantDates';
import ImportantNotables from '@/components/profile/ImportantNotables';
import OrderHistory from '@/components/profile/OrderHistory';
import EditGuestDialog from '@/components/dialogs/EditGuestDialog';
import AddGuestDialog from '@/components/dialogs/AddGuestDialog';
import NavigationHeader from '@/components/navigation/NavigationHeader';
import ProfileCard from '@/components/profile/ProfileCard';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCustomerData } from '@/hooks/useCustomerData';
import { supabase } from '@/integrations/supabase/client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface CustomerProfileProps {
  customerId: string;
  onBack: () => void;
  allCustomers: any[];
  onGuestUpdated: () => void;
}

const CustomerProfile: React.FC<CustomerProfileProps> = ({ 
  customerId, 
  onBack, 
  allCustomers,
  onGuestUpdated
}) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();
  
  const { 
    customer, 
    isLoading, 
    error, 
    invalidateCustomerData, 
    invalidateAllCustomers 
  } = useCustomerData(customerId);

  const handleCustomerSelect = (selectedCustomer: any) => {
    invalidateCustomerData();
    invalidateAllCustomers();
    onGuestUpdated();
  };

  const handleGuestUpdated = () => {
    invalidateCustomerData();
    invalidateAllCustomers();
    onGuestUpdated();
  };

  const handleGuestAdded = () => {
    onGuestUpdated();
  };

  const handleDeleteGuest = async () => {
    setDeleting(true);
    try {
      // Delete all related data first (due to foreign key constraints)
      await supabase.from('customer_tags').delete().eq('customer_id', customer.id);
      await supabase.from('table_preferences').delete().eq('customer_id', customer.id);
      await supabase.from('food_preferences').delete().eq('customer_id', customer.id);
      await supabase.from('wine_preferences').delete().eq('customer_id', customer.id);
      await supabase.from('cocktail_preferences').delete().eq('customer_id', customer.id);
      await supabase.from('spirits_preferences').delete().eq('customer_id', customer.id);
      await supabase.from('allergies').delete().eq('customer_id', customer.id);
      await supabase.from('important_dates').delete().eq('customer_id', customer.id);
      await supabase.from('important_notables').delete().eq('customer_id', customer.id);
      await supabase.from('customer_notes').delete().eq('customer_id', customer.id);
      await supabase.from('connections').delete().eq('customer_id', customer.id);
      await supabase.from('connections').delete().eq('connected_customer_id', customer.id);

      // Delete visits and visit orders
      const { data: visits } = await supabase.from('visits').select('id').eq('customer_id', customer.id);
      if (visits) {
        for (const visit of visits) {
          await supabase.from('visit_orders').delete().eq('visit_id', visit.id);
        }
        await supabase.from('visits').delete().eq('customer_id', customer.id);
      }

      // Finally delete the customer
      const { error } = await supabase.from('customers').delete().eq('id', customer.id);
      if (error) throw error;

      toast({
        title: "Success",
        description: `${customer.name} has been deleted successfully`
      });
      
      // Navigate back to dashboard
      onBack();
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: "Error",
        description: "Failed to delete guest. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto p-6">
          <NavigationHeader 
            onBack={onBack}
            showBackButton={true}
            onAddGuest={() => setShowAddDialog(true)}
          />
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-destructive">Error loading customer data</div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto p-6">
          <NavigationHeader 
            onBack={onBack}
            showBackButton={true}
            onAddGuest={() => setShowAddDialog(true)}
          />
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading customer data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto p-6">
          <NavigationHeader 
            onBack={onBack}
            showBackButton={true}
            onAddGuest={() => setShowAddDialog(true)}
          />
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Customer not found</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        <NavigationHeader 
          onBack={onBack}
          showBackButton={true}
          onAddGuest={() => setShowAddDialog(true)}
        />

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowEditDialog(true)}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Modify Guest
            </Button>
            <Button 
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Guest
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile, Connections, Important Notables, Important Dates */}
          <div className="lg:col-span-1 space-y-4">
            <ProfileCard 
              customer={customer} 
              isEditing={true}
              onCustomerUpdated={handleGuestUpdated}
            />
            <CompactConnections connections={customer.connections} allCustomers={allCustomers} />
            <ImportantNotables notables={customer.importantNotables || []} />
            <ImportantDates importantDates={customer.importantDates} />
          </div>

          {/* Right Column - Details Section */}
          <div className="lg:col-span-2 space-y-6">
            <PreferencesGrid customer={customer} />
            <SpecialNotes notes={customer.notes?.map((note: any) => note.note).join('\n\n') || ''} />
            <OrderHistory visits={customer.visits} />
          </div>
        </div>

        <EditGuestDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onGuestUpdated={handleGuestUpdated}
          customer={customer}
        />

        <AddGuestDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onGuestAdded={handleGuestAdded}
        />

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Guest</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <strong>{customer.name}</strong>? 
                This action cannot be undone and will remove all associated data including 
                preferences, visits, and notes.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteGuest} 
                disabled={deleting} 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? 'Deleting...' : 'Delete Guest'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default CustomerProfile;
