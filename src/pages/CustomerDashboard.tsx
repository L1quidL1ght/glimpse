
import React, { useState } from 'react';
import CustomerProfile from '@/components/CustomerProfile';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSearch from '@/components/dashboard/DashboardSearch';
import GuestList from '@/components/dashboard/GuestList';
import AddGuestDialog from '@/components/dialogs/AddGuestDialog';
import ReservationsView from '@/components/reservations/ReservationsView';
import GuestFilters from '@/components/dashboard/GuestFilters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCustomerDashboard } from '@/hooks/useCustomerDashboard';
import { useGuestFilters } from '@/hooks/useGuestFilters';

const CustomerDashboard = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('guests');

  const {
    customers,
    selectedCustomer,
    searchTerm,
    setSearchTerm,
    setSelectedCustomer,
    loading,
    handleGuestAdded,
    handleGuestUpdated,
    refetch
  } = useCustomerDashboard();

  const {
    filteredCustomers,
    activeFilters,
    handleFilterChange,
    clearFilters
  } = useGuestFilters(customers);

  if (selectedCustomer) {
    return (
      <CustomerProfile
        customerId={selectedCustomer.id}
        onBack={() => setSelectedCustomer(null)}
        allCustomers={customers}
        onGuestUpdated={handleGuestUpdated}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        <DashboardHeader 
          onAddGuest={() => setShowAddDialog(true)}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="guests">Guest List</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
          </TabsList>

          <TabsContent value="guests" className="space-y-6 mt-8">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">Guest Directory</h2>
              <p className="text-muted-foreground">Search and filter your guest database</p>
            </div>
            
            <DashboardSearch 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
            
            <GuestFilters 
              onFilterChange={handleFilterChange}
              activeFilters={activeFilters}
              onClearFilters={clearFilters}
            />
            
            <GuestList 
              customers={filteredCustomers.filter(customer => 
                customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.phone?.includes(searchTerm)
              )}
              onCustomerSelect={setSelectedCustomer}
              onCustomerDeleted={refetch}
            />
          </TabsContent>

          <TabsContent value="reservations" className="mt-8">
            <ReservationsView />
          </TabsContent>
        </Tabs>

        <AddGuestDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onGuestAdded={handleGuestAdded}
        />
      </div>
    </div>
  );
};

export default CustomerDashboard;
