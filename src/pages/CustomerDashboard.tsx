
import React, { useState } from 'react';
import { useCustomerDashboard } from '@/hooks/useCustomerDashboard';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSearch from '@/components/dashboard/DashboardSearch';
import GuestList from '@/components/dashboard/GuestList';
import CustomerProfile from '@/components/CustomerProfile';
import AddGuestDialog from '@/components/dialogs/AddGuestDialog';
import DuplicatePhoneDialog from '@/components/dialogs/DuplicatePhoneDialog';
import AdminLoginDialog from '@/components/dialogs/AdminLoginDialog';
import { Button } from '@/components/ui/button';
import { LogOut, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const CustomerDashboard = () => {
  const {
    customers,
    selectedCustomer,
    searchTerm,
    setSearchTerm,
    setSelectedCustomer,
    isLoading,
    refetch
  } = useCustomerDashboard();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  const handleCustomerSelect = (customer: any) => {
    setSelectedCustomer(customer);
  };

  const handleBack = () => {
    setSelectedCustomer(null);
  };

  const handleGuestAdded = () => {
    refetch();
    setShowAddDialog(false);
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
    setShowAdminDialog(false);
    toast({
      title: "Admin Access Granted",
      description: "You now have admin privileges"
    });
  };

  const handleSignOut = () => {
    setIsAdmin(false);
    toast({
      title: "Signed Out",
      description: "Admin session ended"
    });
  };

  const handleFixDuplicates = async () => {
    try {
      // Call the function to create unique phone constraint
      const { error } = await supabase.rpc('upsert_preference_option', {
        p_category: 'system',
        p_preference_text: 'phone_constraint_check'
      });

      if (error) throw error;

      setShowDuplicateDialog(true);
    } catch (error) {
      console.error('Error checking for duplicates:', error);
      toast({
        title: "Error",
        description: "Failed to check for duplicate phone numbers",
        variant: "destructive"
      });
    }
  };

  const handleDuplicatesResolved = () => {
    setShowDuplicateDialog(false);
    toast({
      title: "Success",
      description: "Duplicate phone numbers resolved",
    });
  };

  if (selectedCustomer) {
    return (
      <CustomerProfile
        customer={selectedCustomer}
        onBack={handleBack}
        allCustomers={customers}
        isAdmin={isAdmin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <DashboardHeader onAddGuest={() => setShowAddDialog(true)} />
          
          {/* Admin Controls */}
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFixDuplicates}
                  className="flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  Fix Duplicates
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdminDialog(true)}
              >
                Admin
              </Button>
            )}
          </div>
        </div>

        <DashboardSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground">Loading guests...</div>
          </div>
        ) : (
          <GuestList
            customers={customers}
            onCustomerSelect={handleCustomerSelect}
            isAdmin={isAdmin}
            onCustomerDeleted={refetch}
          />
        )}

        <AddGuestDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onGuestAdded={handleGuestAdded}
        />

        <DuplicatePhoneDialog
          open={showDuplicateDialog}
          onOpenChange={setShowDuplicateDialog}
          onResolved={handleDuplicatesResolved}
        />

        <AdminLoginDialog
          open={showAdminDialog}
          onOpenChange={setShowAdminDialog}
          onAdminLogin={handleAdminLogin}
        />
      </div>
    </div>
  );
};

export default CustomerDashboard;
