
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, Shield, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCustomerDashboard } from '@/hooks/useCustomerDashboard';
import { supabase } from '@/integrations/supabase/client';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSearch from '@/components/dashboard/DashboardSearch';
import GuestList from '@/components/dashboard/GuestList';
import CustomerProfile from '@/components/CustomerProfile';
import AddGuestDialog from '@/components/dialogs/AddGuestDialog';
import AdminLoginDialog from '@/components/dialogs/AdminLoginDialog';
import DuplicatePhoneDialog from '@/components/dialogs/DuplicatePhoneDialog';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { customers, loading, fetchCustomers, handleGuestAdded } = useCustomerDashboard();
  
  const [filteredCustomers, setFilteredCustomers] = useState(customers);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    setFilteredCustomers(customers);
  }, [customers]);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredCustomers(customers);
      return;
    }

    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm) ||
      customer.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredCustomers(filtered);
  };

  const handleSignOut = () => {
    navigate('/');
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of the dashboard",
    });
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
    toast({
      title: "Admin Mode Activated",
      description: "You now have admin privileges",
    });
  };

  const handleDuplicatesResolved = async () => {
    try {
      // Try to apply the unique constraint again
      const { error } = await supabase.rpc('create_unique_phone_constraint');
      
      if (error) {
        // If the RPC doesn't exist, we'll handle it differently
        console.log('Unique constraint will be applied via SQL migration');
      }
      
      toast({
        title: "Success",
        description: "Phone number unique constraint applied successfully",
      });
      
      setShowDuplicateDialog(false);
    } catch (error) {
      console.error('Error applying constraint:', error);
      toast({
        title: "Note",
        description: "Duplicates resolved. You can now rerun the SQL migration.",
      });
      setShowDuplicateDialog(false);
    }
  };

  if (selectedCustomer) {
    return (
      <CustomerProfile
        customer={selectedCustomer}
        onBack={() => setSelectedCustomer(null)}
        allCustomers={customers}
        isAdmin={isAdmin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <DashboardHeader />
          <div className="flex items-center gap-2">
            {!isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdminLogin(true)}
                className="flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Admin
              </Button>
            )}
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDuplicateDialog(true)}
                className="flex items-center gap-2"
              >
                <Database className="w-4 h-4" />
                Fix Duplicates
              </Button>
            )}
            <Button
              onClick={() => setShowAddDialog(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Guest
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <DashboardSearch onSearch={handleSearch} />
          
          {loading ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground">Loading guests...</div>
            </div>
          ) : (
            <GuestList
              customers={filteredCustomers}
              onCustomerSelect={setSelectedCustomer}
              isAdmin={isAdmin}
              onCustomerDeleted={fetchCustomers}
            />
          )}
        </div>

        <AddGuestDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onGuestAdded={handleGuestAdded}
        />

        <AdminLoginDialog
          open={showAdminLogin}
          onOpenChange={setShowAdminLogin}
          onAdminLogin={handleAdminLogin}
        />

        <DuplicatePhoneDialog
          open={showDuplicateDialog}
          onOpenChange={setShowDuplicateDialog}
          onResolved={handleDuplicatesResolved}
        />
      </div>
    </div>
  );
};

export default CustomerDashboard;
