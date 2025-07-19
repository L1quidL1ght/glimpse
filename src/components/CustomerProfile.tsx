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
      console.log('CustomerProfile: Starting comprehensive delete process for customer:', customer.id, customer.name);
      console.log('CustomerProfile: User role:', role);
      
      // Step 1: Delete customer tags
      try {
        console.log('CustomerProfile: Step 1 - Deleting customer tags...');
        const { data: tagsData, error: tagsError, count } = await supabase
          .from('customer_tags')
          .delete({ count: 'exact' })
          .eq('customer_id', customer.id)
          .select('*');
        
        validateDeleteOperation('Customer tags deletion', tagsError, tagsData, count);
        console.log(`CustomerProfile: Successfully deleted ${count || 0} customer tags`);
        deleteSteps.push(`Deleted ${count || 0} customer tags`);
      } catch (error) {
        console.error('CustomerProfile: Customer tags deletion failed:', error);
        hasErrors = true;
        throw error;
      }
      
      // Step 2: Delete table preferences
      try {
        console.log('CustomerProfile: Step 2 - Deleting table preferences...');
        const { data: tablePrefsData, error: tablePrefsError, count } = await supabase
          .from('table_preferences')
          .delete({ count: 'exact' })
          .eq('customer_id', customer.id)
          .select('*');
        
        validateDeleteOperation('Table preferences deletion', tablePrefsError, tablePrefsData, count);
        console.log(`CustomerProfile: Successfully deleted ${count || 0} table preferences`);
        deleteSteps.push(`Deleted ${count || 0} table preferences`);
      } catch (error) {
        console.error('CustomerProfile: Table preferences deletion failed:', error);
        hasErrors = true;
        throw error;
      }

      // Step 3: Delete food preferences
      try {
        console.log('CustomerProfile: Step 3 - Deleting food preferences...');
        const { data: foodPrefsData, error: foodPrefsError, count } = await supabase
          .from('food_preferences')
          .delete({ count: 'exact' })
          .eq('customer_id', customer.id)
          .select('*');
        
        validateDeleteOperation('Food preferences deletion', foodPrefsError, foodPrefsData, count);
        console.log(`CustomerProfile: Successfully deleted ${count || 0} food preferences`);
        deleteSteps.push(`Deleted ${count || 0} food preferences`);
      } catch (error) {
        console.error('CustomerProfile: Food preferences deletion failed:', error);
        hasErrors = true;
        throw error;
      }

      // Step 4: Delete wine preferences
      try {
        console.log('CustomerProfile: Step 4 - Deleting wine preferences...');
        const { data: winePrefsData, error: winePrefsError, count } = await supabase
          .from('wine_preferences')
          .delete({ count: 'exact' })
          .eq('customer_id', customer.id)
          .select('*');
        
        validateDeleteOperation('Wine preferences deletion', winePrefsError, winePrefsData, count);
        console.log(`CustomerProfile: Successfully deleted ${count || 0} wine preferences`);
        deleteSteps.push(`Deleted ${count || 0} wine preferences`);
      } catch (error) {
        console.error('CustomerProfile: Wine preferences deletion failed:', error);
        hasErrors = true;
        throw error;
      }

      // Step 5: Delete cocktail preferences
      try {
        console.log('CustomerProfile: Step 5 - Deleting cocktail preferences...');
        const { data: cocktailPrefsData, error: cocktailPrefsError, count } = await supabase
          .from('cocktail_preferences')
          .delete({ count: 'exact' })
          .eq('customer_id', customer.id)
          .select('*');
        
        validateDeleteOperation('Cocktail preferences deletion', cocktailPrefsError, cocktailPrefsData, count);
        console.log(`CustomerProfile: Successfully deleted ${count || 0} cocktail preferences`);
        deleteSteps.push(`Deleted ${count || 0} cocktail preferences`);
      } catch (error) {
        console.error('CustomerProfile: Cocktail preferences deletion failed:', error);
        hasErrors = true;
        throw error;
      }

      // Step 6: Delete spirits preferences
      try {
        console.log('CustomerProfile: Step 6 - Deleting spirits preferences...');
        const { data: spiritsPrefsData, error: spiritsPrefsError, count } = await supabase
          .from('spirits_preferences')
          .delete({ count: 'exact' })
          .eq('customer_id', customer.id)
          .select('*');
        
        validateDeleteOperation('Spirits preferences deletion', spiritsPrefsError, spiritsPrefsData, count);
        console.log(`CustomerProfile: Successfully deleted ${count || 0} spirits preferences`);
        deleteSteps.push(`Deleted ${count || 0} spirits preferences`);
      } catch (error) {
        console.error('CustomerProfile: Spirits preferences deletion failed:', error);
        hasErrors = true;
        throw error;
      }

      // Step 7: Delete allergies
      try {
        console.log('CustomerProfile: Step 7 - Deleting allergies...');
        const { data: allergiesData, error: allergiesError, count } = await supabase
          .from('allergies')
          .delete({ count: 'exact' })
          .eq('customer_id', customer.id)
          .select('*');
        
        validateDeleteOperation('Allergies deletion', allergiesError, allergiesData, count);
        console.log(`CustomerProfile: Successfully deleted ${count || 0} allergies`);
        deleteSteps.push(`Deleted ${count || 0} allergies`);
      } catch (error) {
        console.error('CustomerProfile: Allergies deletion failed:', error);
        hasErrors = true;
        throw error;
      }

      // Step 8: Delete important dates
      try {
        console.log('CustomerProfile: Step 8 - Deleting important dates...');
        const { data: datesData, error: datesError, count } = await supabase
          .from('important_dates')
          .delete({ count: 'exact' })
          .eq('customer_id', customer.id)
          .select('*');
        
        validateDeleteOperation('Important dates deletion', datesError, datesData, count);
        console.log(`CustomerProfile: Successfully deleted ${count || 0} important dates`);
        deleteSteps.push(`Deleted ${count || 0} important dates`);
      } catch (error) {
        console.error('CustomerProfile: Important dates deletion failed:', error);
        hasErrors = true;
        throw error;
      }

      // Step 9: Delete important notables
      try {
        console.log('CustomerProfile: Step 9 - Deleting important notables...');
        const { data: notablesData, error: notablesError, count } = await supabase
          .from('important_notables')
          .delete({ count: 'exact' })
          .eq('customer_id', customer.id)
          .select('*');
        
        validateDeleteOperation('Important notables deletion', notablesError, notablesData, count);
        console.log(`CustomerProfile: Successfully deleted ${count || 0} important notables`);
        deleteSteps.push(`Deleted ${count || 0} important notables`);
      } catch (error) {
        console.error('CustomerProfile: Important notables deletion failed:', error);
        hasErrors = true;
        throw error;
      }

      // Step 10: Delete customer notes
      try {
        console.log('CustomerProfile: Step 10 - Deleting customer notes...');
        const { data: notesData, error: notesError, count } = await supabase
          .from('customer_notes')
          .delete({ count: 'exact' })
          .eq('customer_id', customer.id)
          .select('*');
        
        validateDeleteOperation('Customer notes deletion', notesError, notesData, count);
        console.log(`CustomerProfile: Successfully deleted ${count || 0} customer notes`);
        deleteSteps.push(`Deleted ${count || 0} customer notes`);
      } catch (error) {
        console.error('CustomerProfile: Customer notes deletion failed:', error);
        hasErrors = true;
        throw error;
      }

      // Step 11: Delete connections (both directions)
      try {
        console.log('CustomerProfile: Step 11 - Deleting connections where customer is the primary...');
        const { data: connectionsData1, error: connectionsError1, count: count1 } = await supabase
          .from('connections')
          .delete({ count: 'exact' })
          .eq('customer_id', customer.id)
          .select('*');
        
        validateDeleteOperation('Primary connections deletion', connectionsError1, connectionsData1, count1);
        console.log(`CustomerProfile: Successfully deleted ${count1 || 0} primary connections`);
        
        console.log('CustomerProfile: Step 11b - Deleting connections where customer is the connected one...');
        const { data: connectionsData2, error: connectionsError2, count: count2 } = await supabase
          .from('connections')
          .delete({ count: 'exact' })
          .eq('connected_customer_id', customer.id)
          .select('*');
        
        validateDeleteOperation('Reverse connections deletion', connectionsError2, connectionsData2, count2);
        console.log(`CustomerProfile: Successfully deleted ${count2 || 0} reverse connections`);
        deleteSteps.push(`Deleted ${(count1 || 0) + (count2 || 0)} total connections`);
      } catch (error) {
        console.error('CustomerProfile: Connections deletion failed:', error);
        hasErrors = true;
        throw error;
      }

      // Step 12: Delete reservations
      try {
        console.log('CustomerProfile: Step 12 - Deleting reservations...');
        const { data: reservationsData, error: reservationsError, count } = await supabase
          .from('reservations')
          .delete({ count: 'exact' })
          .eq('customer_id', customer.id)
          .select('*');
        
        validateDeleteOperation('Reservations deletion', reservationsError, reservationsData, count);
        console.log(`CustomerProfile: Successfully deleted ${count || 0} reservations`);
        deleteSteps.push(`Deleted ${count || 0} reservations`);
      } catch (error) {
        console.error('CustomerProfile: Reservations deletion failed:', error);
        hasErrors = true;
        throw error;
      }

      // Step 13: Delete visits and visit orders
      try {
        console.log('CustomerProfile: Step 13 - Fetching visits to delete visit orders...');
        const { data: visits, error: visitsSelectError } = await supabase
          .from('visits')
          .select('id')
          .eq('customer_id', customer.id);
        
        if (visitsSelectError) {
          console.error('CustomerProfile: Error fetching visits:', visitsSelectError);
          throw new Error(`Failed to fetch visits: ${visitsSelectError.message} (Code: ${visitsSelectError.code})`);
        }

        let totalVisitOrders = 0;
        if (visits && visits.length > 0) {
          console.log(`CustomerProfile: Found ${visits.length} visits, deleting their orders...`);
          for (const visit of visits) {
            try {
              const { data: ordersData, error: ordersError, count } = await supabase
                .from('visit_orders')
                .delete({ count: 'exact' })
                .eq('visit_id', visit.id)
                .select('*');
              
              validateDeleteOperation(`Visit orders deletion for visit ${visit.id}`, ordersError, ordersData, count);
              totalVisitOrders += count || 0;
              console.log(`CustomerProfile: Deleted ${count || 0} orders for visit ${visit.id}`);
            } catch (error) {
              console.error(`CustomerProfile: Visit orders deletion failed for visit ${visit.id}:`, error);
              hasErrors = true;
              throw error;
            }
          }
          
          console.log('CustomerProfile: Step 13b - Deleting visits...');
          const { data: visitsData, error: visitsError, count } = await supabase
            .from('visits')
            .delete({ count: 'exact' })
            .eq('customer_id', customer.id)
            .select('*');
          
          validateDeleteOperation('Visits deletion', visitsError, visitsData, count);
          console.log(`CustomerProfile: Successfully deleted ${count || 0} visits`);
          deleteSteps.push(`Deleted ${count || 0} visits and ${totalVisitOrders} visit orders`);
        } else {
          console.log('CustomerProfile: No visits found for customer');
          deleteSteps.push('No visits to delete');
        }
      } catch (error) {
        console.error('CustomerProfile: Visits/visit orders deletion failed:', error);
        hasErrors = true;
        throw error;
      }

      // Step 14: Finally delete the customer record (only if all previous steps succeeded)
      try {
        if (hasErrors) {
          throw new Error('Cannot delete customer record - previous deletion steps failed');
        }
        
        console.log('CustomerProfile: Step 14 - Deleting customer record...');
        console.log('CustomerProfile: Current user role for customer deletion:', role);
        
        // Check if user has admin role for customer deletion
        if (role !== 'admin') {
          console.error('CustomerProfile: Admin role required for customer deletion. Current role:', role);
          throw new Error(`Admin role required for customer deletion. Current role: ${role || 'unknown'}`);
        }
        
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .delete()
          .eq('id', customer.id)
          .select('*');
        
        validateDeleteOperation('Customer record deletion', customerError, customerData);
        console.log('CustomerProfile: Successfully deleted customer record');
        deleteSteps.push('Deleted customer record');
      } catch (error) {
        console.error('CustomerProfile: Customer record deletion failed:', error);
        hasErrors = true;
        throw error;
      }

      console.log('CustomerProfile: All deletion steps completed successfully:', deleteSteps);
      toast({
        title: "Success",
        description: `${customer.name} has been deleted successfully. ${deleteSteps.join(', ')}.`
      });
      
      // Step 15: Invalidate cache and navigate back
      try {
        console.log('CustomerProfile: Step 15 - Invalidating cache and updating UI...');
        await invalidateCustomerData();
        await invalidateAllCustomers();
        onGuestUpdated();
        onBack();
        console.log('CustomerProfile: Cache invalidation and navigation completed');
      } catch (error) {
        console.error('CustomerProfile: Cache invalidation failed:', error);
        // Don't throw here as the deletion was successful
        toast({
          title: "Warning",
          description: "Guest deleted successfully, but there was an issue refreshing the data. Please refresh the page.",
          variant: "destructive"
        });
        onBack(); // Still navigate back
      }

    } catch (error) {
      console.error('CustomerProfile: Guest deletion failed at step:', deleteSteps.length + 1, 'Error:', error);
      console.error('CustomerProfile: Completed steps before failure:', deleteSteps);
      
      let errorMessage = 'Failed to delete guest. Please try again.';
      if (error instanceof Error) {
        errorMessage = `Delete failed: ${error.message}`;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
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
