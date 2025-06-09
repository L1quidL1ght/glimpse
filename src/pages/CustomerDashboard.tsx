
import React, { useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CustomerCard from '@/components/CustomerCard';
import CustomerProfile from '@/components/CustomerProfile';

const CustomerDashboard = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock customer data
  const customers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
      avatar: '/placeholder.svg',
      lastVisit: '2024-06-05',
      totalVisits: 12,
      favoriteTable: 'Table 7',
      foodPreferences: ['Vegetarian', 'Gluten-free'],
      winePreferences: ['Pinot Noir', 'Sauvignon Blanc'],
      cocktailPreferences: ['Moscow Mule', 'Aperol Spritz'],
      allergies: ['Shellfish', 'Nuts'],
      importantDates: [
        { date: '2024-08-15', event: 'Anniversary' },
        { date: '2024-12-03', event: 'Birthday' }
      ],
      connections: [
        { id: 2, name: 'Michael Johnson', relationship: 'Husband' }
      ],
      visits: [
        { date: '2024-06-05', party: 2, table: 'Table 7', notes: 'Celebrated anniversary' },
        { date: '2024-05-20', party: 4, table: 'Table 12', notes: 'Business dinner' }
      ],
      notes: 'Prefers window seating. Always orders dessert.'
    },
    {
      id: 2,
      name: 'Michael Johnson',
      email: 'michael.johnson@email.com',
      phone: '(555) 123-4568',
      avatar: '/placeholder.svg',
      lastVisit: '2024-06-05',
      totalVisits: 12,
      favoriteTable: 'Table 7',
      foodPreferences: ['Steak', 'Seafood'],
      winePreferences: ['Cabernet Sauvignon', 'Malbec'],
      cocktailPreferences: ['Old Fashioned', 'Whiskey Sour'],
      allergies: ['None'],
      importantDates: [
        { date: '2024-08-15', event: 'Anniversary' }
      ],
      connections: [
        { id: 1, name: 'Sarah Johnson', relationship: 'Wife' }
      ],
      visits: [
        { date: '2024-06-05', party: 2, table: 'Table 7', notes: 'Celebrated anniversary' }
      ],
      notes: 'Enjoys wine pairings. Regular customer.'
    }
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Guest Database</h1>
          <p className="text-muted-foreground">Manage and view guest profiles and preferences</p>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search guests by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Guest
            </Button>
          </div>
        </div>

        {/* Customer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCustomers.map(customer => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onClick={() => setSelectedCustomer(customer)}
            />
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No guests found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
