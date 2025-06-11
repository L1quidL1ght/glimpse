
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
import SearchHeader from '@/components/profile/SearchHeader';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface CustomerProfileProps {
  customer: any;
  onBack: () => void;
  allCustomers: any[];
  isAdmin?: boolean;
}

const CustomerProfile: React.FC<CustomerProfileProps> = ({ 
  customer, 
  onBack, 
  allCustomers,
  isAdmin = false 
}) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleCustomerSelect = (selectedCustomer: any) => {
    window.location.reload();
  };

  const handleGuestUpdated = () => {
    window.location.reload();
  };

  const handleGuestAdded = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        <NavigationHeader 
          onBack={onBack}
          showBackButton={true}
          onAddGuest={() => setShowAddDialog(true)}
        />

        <div className="flex items-center justify-between mb-6">
          <SearchHeader 
            onBack={onBack} 
            allCustomers={allCustomers}
            onCustomerSelect={handleCustomerSelect}
            currentCustomer={customer}
          />
          {isAdmin && (
            <Button 
              onClick={() => setShowEditDialog(true)}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Guest
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile, Connections, Important Notables, Important Dates */}
          <div className="lg:col-span-1 space-y-4">
            <ProfileCard 
              customer={customer} 
              isEditing={isAdmin}
              onCustomerUpdated={handleGuestUpdated}
            />
            <CompactConnections connections={customer.connections} allCustomers={allCustomers} />
            <ImportantNotables notables={customer.importantNotables || []} />
            <ImportantDates importantDates={customer.importantDates} />
          </div>

          {/* Right Column - Details Section */}
          <div className="lg:col-span-2 space-y-6">
            <PreferencesGrid customer={customer} />
            <SpecialNotes notes={customer.notes} />
            <OrderHistory visits={customer.visits} />
          </div>
        </div>

        {isAdmin && (
          <EditGuestDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            onGuestUpdated={handleGuestUpdated}
            customer={customer}
          />
        )}

        <AddGuestDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onGuestAdded={handleGuestAdded}
        />
      </div>
    </div>
  );
};

export default CustomerProfile;
