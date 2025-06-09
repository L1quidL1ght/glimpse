import React, { useState } from 'react';
import { Search, Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Logo from '@/components/Logo';
import GuestListItem from '@/components/GuestListItem';
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
      tablePreferences: ['Window seating', 'Quiet area', 'Corner booth'],
      foodPreferences: ['Vegetarian', 'Gluten-free'],
      winePreferences: ['Pinot Noir', 'Sauvignon Blanc'],
      cocktailPreferences: ['Moscow Mule', 'Aperol Spritz'],
      spiritsPreferences: ['Vodka', 'Gin', 'Light rum'],
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
      notes: 'Prefers window seating. Always orders dessert. Very particular about wine pairings and likes to try new cocktails.',
      importantNotables: ['VIP client', 'Wine connoisseur', 'Prefers romantic atmosphere', 'Always celebrates special occasions here']
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
      tablePreferences: ['Bar seating', 'High-top tables'],
      foodPreferences: ['Steak', 'Seafood'],
      winePreferences: ['Cabernet Sauvignon', 'Malbec'],
      cocktailPreferences: ['Old Fashioned', 'Whiskey Sour'],
      spiritsPreferences: ['Whiskey', 'Bourbon', 'Scotch'],
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
      notes: 'Enjoys wine pairings. Regular customer. Often orders multiple courses and likes to discuss wine selections with sommelier.',
      importantNotables: ['Business professional', 'Whiskey enthusiast', 'Enjoys detailed wine discussions', 'Generous tipper']
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
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Logo />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
            <Button size="icon" className="bg-primary hover:bg-primary/90">
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
        <div className="space-y-2">
          {filteredCustomers.map(customer => (
            <GuestListItem
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
