
import React from 'react';
import SearchHeader from '@/components/profile/SearchHeader';
import ProfileCard from '@/components/profile/ProfileCard';
import CompactConnections from '@/components/profile/CompactConnections';
import PreferencesGrid from '@/components/profile/PreferencesGrid';
import SpecialNotes from '@/components/profile/SpecialNotes';
import ImportantDates from '@/components/profile/ImportantDates';
import ImportantNotables from '@/components/profile/ImportantNotables';
import OrderHistory from '@/components/profile/OrderHistory';

interface CustomerProfileProps {
  customer: any;
  onBack: () => void;
  allCustomers: any[];
}

const CustomerProfile: React.FC<CustomerProfileProps> = ({ customer, onBack, allCustomers }) => {
  const handleCustomerSelect = (selectedCustomer: any) => {
    // This would typically update the current customer view
    window.location.reload(); // Simple approach for now
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        <SearchHeader 
          onBack={onBack} 
          allCustomers={allCustomers}
          onCustomerSelect={handleCustomerSelect}
          currentCustomer={customer}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile, Connections, Important Notables, Important Dates */}
          <div className="lg:col-span-1 space-y-4">
            <ProfileCard customer={customer} />
            <CompactConnections connections={customer.connections} allCustomers={allCustomers} />
            <ImportantNotables notables={customer.importantNotables || ['High-value client', 'Prefers quiet atmosphere', 'Regular wine enthusiast']} />
            <ImportantDates importantDates={customer.importantDates} />
          </div>

          {/* Right Column - Details Section */}
          <div className="lg:col-span-2 space-y-6">
            <PreferencesGrid customer={customer} />
            <SpecialNotes notes={customer.notes} />
            <OrderHistory visits={customer.visits} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
