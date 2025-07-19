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
    
    try {
      console.log('CustomerProfile: Starting comprehensive delete process for customer:', customer.id, customer.name);
      
      // Step 1: Delete customer tags
      try {
        console.log('CustomerProfile: Step 1 - Deleting customer tags...');
        const { data: tagsData, error: tagsError, count } = await supabase
          .from('customer_tags')
          .delete({ count: 'exact' })
          .eq('customer_id', customer.id)
          .select('*');
        
        if (tagsError) {
          console.error('CustomerProfile: Error deleting customer tags:', tagsError);
          throw new Error(`Failed to delete customer tags: ${tagsError.message} (Code: ${tagsError.code})`);
        }
        console.log(`CustomerProfile: Successfully deleted ${count || 0} customer tags`);
        deleteSteps.push(`Deleted ${count || 0} customer tags`);
      } catch (error) {
        console.error('CustomerProfile: Customer tags deletion failed:', error);
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
        
        if (tablePrefsError) {
          console.error('CustomerProfile: Error deleting table preferences:', tablePrefsError);
          throw new Error(`Failed to delete table preferences: ${tablePrefsError.message} (Code: ${tablePrefsError.code})`);
        }
        console.log(`CustomerProfile: Successfully deleted ${count || 0} table preferences`);
        deleteSteps.push(`Deleted ${count || 0} table preferences`);
      } catch (error) {
        console.error('CustomerProfile: Table preferences deletion failed:', error);
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
        
        if (foodPrefsError) {
          console.error('CustomerProfile: Error deleting food preferences:', foodPrefsError);
          throw new Error(`Failed to delete food preferences: ${foodPrefsError.message} (Code: ${foodPrefsError.code})`);
        }
        console.log(`CustomerProfile: Successfully deleted ${count || 0} food preferences`);
        deleteSteps.push(`Deleted ${count || 0} food preferences`);
      } catch (error) {
        console.error('CustomerProfile: Food preferences deletion failed:', error);
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
        
        if (winePrefsError) {
          console.error('CustomerProfile: Error deleting wine preferences:', winePrefsError);
          throw new Error(`Failed to delete wine preferences: ${winePrefsError.message} (Code: ${winePrefsError.code})`);
        }
        console.log(`CustomerProfile: Successfully deleted ${count || 0} wine preferences`);
        deleteSteps.push(`Deleted ${count || 0} wine preferences`);
      } catch (error) {
        console.error('CustomerProfile: Wine preferences deletion failed:', error);
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
        
        if (cocktailPrefsError) {
          console.error('CustomerProfile: Error deleting cocktail preferences:', cocktailPrefsError);
          throw new Error(`Failed to delete cocktail preferences: ${cocktailPrefsError.message} (Code: ${cocktailPrefsError.code})`);
        }
        console.log(`CustomerProfile: Successfully deleted ${count || 0} cocktail preferences`);
        deleteSteps.push(`Deleted ${count || 0} cocktail preferences`);
      } catch (error) {
        console.error('CustomerProfile: Cocktail preferences deletion failed:', error);
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
        
        if (spiritsPrefsError) {
          console.error('CustomerProfile: Error deleting spirits preferences:', spiritsPrefsError);
          throw new Error(`Failed to delete spirits preferences: ${spiritsPrefsError.message} (Code: ${spiritsPrefsError.code})`);
        }
        console.log(`CustomerProfile: Successfully deleted ${count || 0} spirits preferences`);
        deleteSteps.push(`Deleted ${count || 0} spirits preferences`);
      } catch (error) {
        console.error('CustomerProfile: Spirits preferences deletion failed:', error);
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
        
        if (allergiesError) {
          console.error('CustomerProfile: Error deleting allergies:', allergiesError);
          throw new Error(`Failed to delete allergies: ${allergiesError.message} (Code: ${allergiesError.code})`);
        }
        console.log(`CustomerProfile: Successfully deleted ${count || 0} allergies`);
        deleteSteps.push(`Deleted ${count || 0} allergies`);
      } catch (error) {
        console.error('CustomerProfile: Allergies deletion failed:', error);
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
        
        if (datesError) {
          console.error('CustomerProfile: Error deleting important dates:', datesError);
          throw new Error(`Failed to delete important dates: ${datesError.message} (Code: ${datesError.code})`);
        }
        console.log(`CustomerProfile: Successfully deleted ${count || 0} important dates`);
        deleteSteps.push(`Deleted ${count || 0} important dates`);
      } catch (error) {
        console.error('CustomerProfile: Important dates deletion failed:', error);
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
        
        if (notablesError) {
          console.error('CustomerProfile: Error deleting important notables:', notablesError);
          throw new Error(`Failed to delete important notables: ${notablesError.message} (Code: ${notablesError.code})`);
        }
        console.log(`CustomerProfile: Successfully deleted ${count || 0} important notables`);
        deleteSteps.push(`Deleted ${count || 0} important notables`);
      } catch (error) {
        console.error('CustomerProfile: Important notables deletion failed:', error);
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
        
        if (notesError) {
          console.error('CustomerProfile: Error deleting customer notes:', notesError);
          throw new Error(`Failed to delete customer notes: ${notesError.message} (Code: ${notesError.code})`);
        }
        console.log(`CustomerProfile: Successfully deleted ${count || 0} customer notes`);
        deleteSteps.push(`Deleted ${count || 0} customer notes`);
      } catch (error) {
        console.error('CustomerProfile: Customer notes deletion failed:', error);
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
        
        if (connectionsError1) {
          console.error('CustomerProfile: Error deleting primary connections:', connectionsError1);
          throw new Error(`Failed to delete primary connections: ${connectionsError1.message} (Code: ${connectionsError1.code})`);
        }
        console.log(`CustomerProfile: Successfully deleted ${count1 || 0} primary connections`);
        
        console.log('CustomerProfile: Step 11b - Deleting connections where customer is the connected one...');
        const { data: connectionsData2, error: connectionsError2, count: count2 } = await supabase
          .from('connections')
          .delete({ count: 'exact' })
          .eq('connected_customer_id', customer.id)
          .select('*');
        
        if (connectionsError2) {
          console.error('CustomerProfile: Error deleting reverse connections:', connectionsError2);
          throw new Error(`Failed to delete reverse connections: ${connectionsError2.message} (Code: ${connectionsError2.code})`);
        }
        console.log(`CustomerProfile: Successfully deleted ${count2 || 0} reverse connections`);
        deleteSteps.push(`Deleted ${(count1 || 0) + (count2 || 0)} total connections`);
      } catch (error) {
        console.error('CustomerProfile: Connections deletion failed:', error);
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
        
        if (reservationsError) {
          console.error('CustomerProfile: Error deleting reservations:', reservationsError);
          throw new Error(`Failed to delete reservations: ${reservationsError.message} (Code: ${reservationsError.code})`);
        }
        console.log(`CustomerProfile: Successfully deleted ${count || 0} reservations`);
        deleteSteps.push(`Deleted ${count || 0} reservations`);
      } catch (error) {
        console.error('CustomerProfile: Reservations deletion failed:', error);
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
              
              if (ordersError) {
                console.error(`CustomerProfile: Error deleting orders for visit ${visit.id}:`, ordersError);
                throw new Error(`Failed to delete orders for visit ${visit.id}: ${ordersError.message} (Code: ${ordersError.code})`);
              }
              totalVisitOrders += count || 0;
              console.log(`CustomerProfile: Deleted ${count || 0} orders for visit ${visit.id}`);
            } catch (error) {
              console.error(`CustomerProfile: Visit orders deletion failed for visit ${visit.id}:`, error);
              throw error;
            }
          }
          
          console.log('CustomerProfile: Step 13b - Deleting visits...');
          const { data: visitsData, error: visitsError, count } = await supabase
            .from('visits')
            .delete({ count: 'exact' })
            .eq('customer_id', customer.id)
            .select('*');
          
          if (visitsError) {
            console.error('CustomerProfile: Error deleting visits:', visitsError);
            throw new Error(`Failed to delete visits: ${visitsError.message} (Code: ${visitsError.code})`);
          }
          console.log(`CustomerProfile: Successfully deleted ${count || 0} visits`);
          deleteSteps.push(`Deleted ${count || 0} visits and ${totalVisitOrders} visit orders`);
        } else {
          console.log('CustomerProfile: No visits found for customer');
          deleteSteps.push('No visits to delete');
        }
      } catch (error) {
        console.error('CustomerProfile: Visits/visit orders deletion failed:', error);
        throw error;
      }

      // Step 14: Finally delete the customer record
      try {
        console.log('CustomerProfile: Step 14 - Deleting customer record...');
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .delete()
          .eq('id', customer.id)
          .select('*');
        
        if (customerError) {
          console.error('CustomerProfile: Error deleting customer:', customerError);
          throw new Error(`Failed to delete customer: ${customerError.message} (Code: ${customerError.code})`);
        }
        console.log('CustomerProfile: Successfully deleted customer record');
        deleteSteps.push('Deleted customer record');
      } catch (error) {
        console.error('CustomerProfile: Customer record deletion failed:', error);
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
