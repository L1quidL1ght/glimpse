
import React from 'react';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileCard from '@/components/profile/ProfileCard';
import ConnectionsList from '@/components/profile/ConnectionsList';
import PreferencesGrid from '@/components/profile/PreferencesGrid';
import SpecialNotes from '@/components/profile/SpecialNotes';
import ImportantDates from '@/components/profile/ImportantDates';
import VisitHistory from '@/components/profile/VisitHistory';

interface CustomerProfileProps {
  customer: any;
  onBack: () => void;
  allCustomers: any[];
}

const CustomerProfile: React.FC<CustomerProfileProps> = ({ customer, onBack, allCustomers }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        <ProfileHeader onBack={onBack} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card and Connections */}
          <div className="lg:col-span-1">
            <ProfileCard customer={customer} />
            <ConnectionsList connections={customer.connections} />
          </div>

          {/* Right Column - Details Section */}
          <div className="lg:col-span-2 space-y-6">
            <PreferencesGrid customer={customer} />
            <SpecialNotes notes={customer.notes} />
            <ImportantDates importantDates={customer.importantDates} />
            <VisitHistory visits={customer.visits} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
