
import React, { useState } from 'react';
import SearchHeader from '@/components/profile/SearchHeader';
import ProfileCard from '@/components/profile/ProfileCard';
import CompactConnections from '@/components/profile/CompactConnections';
import PreferencesGrid from '@/components/profile/PreferencesGrid';
import SpecialNotes from '@/components/profile/SpecialNotes';
import ImportantDates from '@/components/profile/ImportantDates';
import ImportantNotables from '@/components/profile/ImportantNotables';
import OrderHistory from '@/components/profile/OrderHistory';
import EditGuestDialog from '@/components/dialogs/EditGuestDialog';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface CustomerProfileProps {
  customer: any;
  onBack: () => void;
  allCustomers: any[];
}

const CustomerProfile: React.FC<CustomerProfileProps> = ({ customer, onBack, allCustomers }) => {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleCustomerSelect = (selectedCustomer: any) => {
    window.location.reload();
  };

  const handleGuestUpdated = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <SearchHeader 
            onBack={onBack} 
            allCustomers={allCustomers}
            onCustomerSelect={handleCustomerSelect}
            currentCustomer={customer}
          />
          <Button 
            onClick={() => setShowEditDialog(true)}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Guest
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile, Connections, Important Notables, Important Dates */}
          <div className="lg:col-span-1 space-y-4">
            <ProfileCard customer={customer} />
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

        <EditGuestDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onGuestUpdated={handleGuestUpdated}
          customer={customer}
        />
      </div>
    </div>
  );
};

export default CustomerProfile;
