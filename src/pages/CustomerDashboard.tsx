
import React, { useState, useEffect } from 'react';
import CustomerProfile from '@/components/CustomerProfile';
import AddGuestDialog from '@/components/dialogs/AddGuestDialog';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSearch from '@/components/dashboard/DashboardSearch';
import GuestList from '@/components/dashboard/GuestList';
import { useCustomerDashboard } from '@/hooks/useCustomerDashboard';

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  tags?: string[];
  totalVisits?: number;
  lastVisit?: string;
  favoriteTable?: string;
  tablePreferences?: string[];
  foodPreferences?: Array<{value: string, isGolden: boolean}>;
  winePreferences?: Array<{value: string, isGolden: boolean}>;
  cocktailPreferences?: Array<{value: string, isGolden: boolean}>;
  spiritsPreferences?: Array<{value: string, isGolden: boolean}>;
  allergies?: string[];
  importantDates?: Array<{event: string, date: string}>;
  connections?: Array<{name: string, relationship: string}>;
  visits?: Array<{
    date: string;
    party: number;
    table: string;
    notes: string;
    orders: {
      appetizers: string[];
      entrees: string[];
      cocktails: string[];
      desserts: string[];
    };
  }>;
  notes?: string;
  importantNotables?: string[];
}

const CustomerDashboard = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { customers, loading, fetchCustomers, handleGuestAdded } = useCustomerDashboard();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const onGuestAdded = () => {
    handleGuestAdded();
    setShowAddDialog(false);
  };

  if (selectedCustomer) {
    return (
      <CustomerProfile 
        customer={selectedCustomer} 
        onBack={() => setSelectedCustomer(null)}
        allCustomers={customers}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <DashboardHeader onAddGuest={() => setShowAddDialog(true)} />
        
        <DashboardSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <GuestList
          customers={customers}
          loading={loading}
          searchTerm={searchTerm}
          onCustomerSelect={setSelectedCustomer}
        />

        <AddGuestDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onGuestAdded={onGuestAdded}
        />
      </div>
    </div>
  );
};

export default CustomerDashboard;
