
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, ArrowLeft, Grid, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import CustomerCard from '@/components/CustomerCard';
import GuestListItem from '@/components/GuestListItem';
import CustomerProfile from '@/components/CustomerProfile';
import AddCustomerDialog from '@/components/AddCustomerDialog';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  // Computed fields from joins
  totalVisits: number;
  lastVisit: string;
  favoriteTable: string;
  tablePreferences: string[];
  foodPreferences: string[];
  winePreferences: string[];
  cocktailPreferences: string[];
  spiritsPreferences: string[];
  allergies: string[];
  connections: any[];
  visits: any[];
  notes: string[];
  importantDates: any[];
  importantNotables: string[];
}

const CustomerDashboard = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // Fetch customers with all related data
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .order('name');

      if (customersError) throw customersError;

      // For each customer, fetch their related data
      const enrichedCustomers = await Promise.all(
        customersData.map(async (customer) => {
          // Fetch all related data in parallel
          const [
            tablePrefs,
            foodPrefs,
            winePrefs,
            cocktailPrefs,
            spiritsPrefs,
            allergies,
            dates,
            notables,
            notes,
            visits,
            connections
          ] = await Promise.all([
            supabase.from('table_preferences').select('preference').eq('customer_id', customer.id),
            supabase.from('food_preferences').select('preference, is_golden').eq('customer_id', customer.id),
            supabase.from('wine_preferences').select('preference, is_golden').eq('customer_id', customer.id),
            supabase.from('cocktail_preferences').select('preference, is_golden').eq('customer_id', customer.id),
            supabase.from('spirits_preferences').select('preference, is_golden').eq('customer_id', customer.id),
            supabase.from('allergies').select('allergy').eq('customer_id', customer.id),
            supabase.from('important_dates').select('*').eq('customer_id', customer.id),
            supabase.from('important_notables').select('notable').eq('customer_id', customer.id),
            supabase.from('customer_notes').select('note').eq('customer_id', customer.id),
            supabase.from('visits').select(`
              *,
              visit_orders (
                category,
                item
              )
            `).eq('customer_id', customer.id).order('visit_date', { ascending: false }),
            supabase.from('connections').select(`
              *,
              connected_customer:customers!connections_connected_customer_id_fkey (
                id,
                name,
                email
              )
            `).eq('customer_id', customer.id)
          ]);

          // Process the data
          const lastVisit = visits.data?.[0]?.visit_date || customer.created_at;
          const totalVisits = visits.data?.length || 0;
          const favoriteTable = visits.data?.[0]?.table_name || 'Not set';

          return {
            ...customer,
            totalVisits,
            lastVisit,
            favoriteTable,
            tablePreferences: tablePrefs.data?.map(t => t.preference) || [],
            foodPreferences: foodPrefs.data?.map(f => f.preference) || [],
            winePreferences: winePrefs.data?.map(w => w.preference) || [],
            cocktailPreferences: cocktailPrefs.data?.map(c => c.preference) || [],
            spiritsPreferences: spiritsPrefs.data?.map(s => s.preference) || [],
            allergies: allergies.data?.map(a => a.allergy) || [],
            connections: connections.data || [],
            visits: visits.data || [],
            notes: notes.data?.map(n => n.note) || [],
            importantDates: dates.data || [],
            importantNotables: notables.data?.map(n => n.notable) || []
          };
        })
      );

      setCustomers(enrichedCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Error",
        description: "Failed to load customer data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  const handleCustomerAdded = () => {
    fetchCustomers(); // Refresh the list
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
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Guest Management</h1>
            <p className="text-muted-foreground">Manage your restaurant guests and their preferences</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </Button>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Guest
            </Button>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search guests by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-4">
            <Card className="p-3">
              <div className="text-sm text-muted-foreground">Total Guests</div>
              <div className="text-2xl font-bold">{customers.length}</div>
            </Card>
            <Card className="p-3">
              <div className="text-sm text-muted-foreground">Recent Visits</div>
              <div className="text-2xl font-bold">
                {customers.reduce((sum, c) => sum + c.totalVisits, 0)}
              </div>
            </Card>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-20 bg-muted rounded"></div>
              </Card>
            ))}
          </div>
        )}

        {/* Customers Grid/List */}
        {!loading && (
          <>
            {filteredCustomers.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="text-muted-foreground">
                  {searchTerm ? 'No guests found matching your search.' : 'No guests yet. Add your first guest to get started.'}
                </div>
              </Card>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-2"
              }>
                {filteredCustomers.map((customer) =>
                  viewMode === 'grid' ? (
                    <CustomerCard
                      key={customer.id}
                      customer={customer}
                      onClick={() => setSelectedCustomer(customer)}
                    />
                  ) : (
                    <GuestListItem
                      key={customer.id}
                      customer={customer}
                      onClick={() => setSelectedCustomer(customer)}
                    />
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>

      <AddCustomerDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onCustomerAdded={handleCustomerAdded}
      />
    </div>
  );
};

export default CustomerDashboard;
