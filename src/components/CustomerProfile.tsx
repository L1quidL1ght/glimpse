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

  const handleGuestUpdated = async () => {
    console.log('CustomerProfile: handleGuestUpdated called, invalidating data for customer:', customerId);
    
    // Invalidate React Query cache to force refetch
    await invalidateCustomerData();
    await invalidateAllCustomers();
    
    console.log('CustomerProfile: Data invalidated, calling parent onGuestUpdated');
    onGuestUpdated();
    
    console.log('CustomerProfile: Guest update complete');
  };

  const handleGuestAdded = () => {
    onGuestUpdated();
  };

  const handleDeleteGuest = async () => {
    setDeleting(true);
    const deleteSteps = [];
    let hasErrors = false;
    
    const validateDeleteOperation = (operation: string, error: any, data: any, count?: number) => {
      if (error) {
        console.error(`CustomerProfile: ${operation} failed:`, error);
        console.error(`CustomerProfile: Error details:`, {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        throw new Error(`${operation} failed: ${error.message} (Code: ${error.code || 'UNKNOWN'})`);
      }
      
      // Additional validation - ensure the operation response is valid
      if (data === undefined && count === undefined) {
        console.error(`CustomerProfile: ${operation} returned invalid response - no data or count`);
        throw new Error(`${operation} returned invalid response`);
      }
      
      console.log(`CustomerProfile: ${operation} completed successfully. Count: ${count || 0}, Data length: ${data?.length || 0}`);
      return true;
    };

    // Validate customer exists and get current user role
    const validatePrerequisites = async () => {
      console.log('CustomerProfile: Validating prerequisites...');
      
      // Check if customer exists
      if (!customer || !customer.id) {
        throw new Error('Invalid customer: Customer ID is missing or invalid');
      }
      
      // Check if customer exists in database
      const { data: customerCheck, error: customerCheckError } = await supabase
        .from('customers')
        .select('id, name')
        .eq('id', customer.id)
        .single();
      
      if (customerCheckError) {
        console.error('CustomerProfile: Customer validation failed:', customerCheckError);
        throw new Error(`Customer validation failed: ${customerCheckError.message}`);
      }
      
      if (!customerCheck) {
        throw new Error('Customer not found in database');
      }
      
      console.log(`CustomerProfile: Customer validated: ${customerCheck.name} (${customerCheck.id})`);
      
      // Check staff authentication and role
      const { data: roleData, error: roleError } = await supabase.rpc('get_current_user_role');
      console.log('CustomerProfile: Current user role:', roleData, 'Error:', roleError);
      
      // Check staff authentication
      const { data: authData, error: authError } = await supabase.rpc('is_staff_authenticated');
      console.log('CustomerProfile: Staff authenticated:', authData, 'Error:', authError);
      
      if (!authData) {
        throw new Error('Staff authentication required for deletion operations');
      }
      
      return { customerCheck, role: roleData };
    };
    
    try {
      const { customerCheck, role } = await validatePrerequisites();
      console.log('CustomerProfile: Starting atomic delete process for customer:', customer.id, customer.name);
      console.log('CustomerProfile: User role:', role);
      
      // Check if user has admin role for customer deletion
      if (role !== 'admin') {
        console.error('CustomerProfile: Admin role required for customer deletion. Current role:', role);
        throw new Error(`Admin role required for customer deletion. Current role: ${role || 'unknown'}`);
      }
      
      console.log('CustomerProfile: Prerequisites validated. Proceeding with atomic deletion...');
      
      // Use the atomic deletion function that handles transactions and cascade deletes
      const { data: deletionResult, error: deletionError } = await supabase.rpc('delete_customer_atomically', {
        customer_uuid: customer.id
      });
      
      if (deletionError) {
        console.error('CustomerProfile: Atomic deletion failed:', deletionError);
        throw new Error(`Atomic deletion failed: ${deletionError.message} (Code: ${deletionError.code})`);
      }
      
      // Parse the JSON result properly
      const result = typeof deletionResult === 'string' ? JSON.parse(deletionResult) : deletionResult;
      
      if (!result || !result.success) {
        console.error('CustomerProfile: Deletion function returned failure:', result);
        throw new Error(`Deletion failed: ${result?.error || 'Unknown error in deletion function'}`);
      }
      
      console.log('CustomerProfile: Atomic deletion completed successfully:', result);
      
      const deletedCounts = result.deleted_counts;
      const deletionSummary = [
        `Deleted ${deletedCounts.customer_tags} customer tags`,
        `Deleted ${deletedCounts.table_preferences} table preferences`,
        `Deleted ${deletedCounts.food_preferences} food preferences`,
        `Deleted ${deletedCounts.wine_preferences} wine preferences`,
        `Deleted ${deletedCounts.cocktail_preferences} cocktail preferences`,
        `Deleted ${deletedCounts.spirits_preferences} spirits preferences`,
        `Deleted ${deletedCounts.allergies} allergies`,
        `Deleted ${deletedCounts.important_dates} important dates`,
        `Deleted ${deletedCounts.important_notables} important notables`,
        `Deleted ${deletedCounts.customer_notes} customer notes`,
        `Deleted ${deletedCounts.connections} connections`,
        `Deleted ${deletedCounts.reservations} reservations`,
        `Deleted ${deletedCounts.visits} visits`,
        `Deleted ${deletedCounts.visit_orders} visit orders`,
        'Deleted customer record'
      ];
      
      console.log('CustomerProfile: All deletion steps completed successfully:', deletionSummary);
      
      // Step: Invalidating cache and updating UI
      try {
        console.log('CustomerProfile: Step - Invalidating cache and updating UI...');
        await invalidateCustomerData();
        await invalidateAllCustomers();
        
        console.log('CustomerProfile: Cache invalidation and navigation completed');
        
        toast({
          title: "Guest deleted successfully",
          description: `${customer.name} and all associated data have been permanently deleted. Summary: ${deletionSummary.join(', ')}`,
        });
        
        onBack();
      } catch (cacheError) {
        console.warn('CustomerProfile: Cache invalidation failed, but deletion was successful:', cacheError);
        toast({
          title: "Guest deleted successfully",
          description: `${customer.name} has been deleted. Please refresh the page to see updated data.`,
          variant: "destructive"
        });
        
        onBack();
      }

    } catch (error) {
      console.error('CustomerProfile: Guest deletion failed:', error);
      toast({
        title: "Failed to delete guest",
        description: error instanceof Error ? error.message : "An unexpected error occurred during deletion",
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
