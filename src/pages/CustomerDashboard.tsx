
import React, { useState, useEffect } from 'react';
import { Search, Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Logo from '@/components/Logo';
import GuestListItem from '@/components/GuestListItem';
import CustomerProfile from '@/components/CustomerProfile';
import AddGuestDialog from '@/components/dialogs/AddGuestDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      
      // Fetch customers with their tags
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select(`
          *,
          customer_tags (tag_name)
        `)
        .order('name');

      if (customersError) throw customersError;

      // Transform the data to match our Customer interface
      const transformedCustomers: Customer[] = customersData.map(customer => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        avatar_url: customer.avatar_url,
        created_at: customer.created_at,
        updated_at: customer.updated_at,
        tags: customer.customer_tags?.map((tag: any) => tag.tag_name) || [],
        totalVisits: 0, // Will be calculated from visits table
        lastVisit: undefined, // Will be calculated from visits table
        favoriteTable: undefined,
        tablePreferences: [],
        foodPreferences: [],
        winePreferences: [],
        cocktailPreferences: [],
        spiritsPreferences: [],
        allergies: [],
        importantDates: [],
        connections: [],
        visits: [],
        notes: '',
        importantNotables: []
      }));

      setCustomers(transformedCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive",
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
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleGuestAdded = () => {
    // Refresh the customer list when a guest is added/updated
    fetchCustomers();
    setShowAddDialog(false);
    toast({
      title: "Success",
      description: "Guest list updated successfully",
    });
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Logo />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
            <Button 
              size="icon" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => setShowAddDialog(true)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search guests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {/* Guest List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Loading guests...</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCustomers.map(customer => (
              <GuestListItem
                key={customer.id}
                customer={customer}
                onClick={() => setSelectedCustomer(customer)}
              />
            ))}
          </div>
        )}

        {!loading && filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchTerm ? 'No guests found matching your search.' : 'No guests found. Add your first guest!'}
            </p>
          </div>
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

export default CustomerDashboard;
