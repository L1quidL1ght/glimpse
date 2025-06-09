
import React from 'react';
import GuestListItem from '@/components/GuestListItem';

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

interface GuestListProps {
  customers: Customer[];
  loading: boolean;
  searchTerm: string;
  onCustomerSelect: (customer: Customer) => void;
}

const GuestList: React.FC<GuestListProps> = ({ customers, loading, searchTerm, onCustomerSelect }) => {
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">Loading guests...</p>
      </div>
    );
  }

  if (filteredCustomers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          {searchTerm ? 'No guests found matching your search.' : 'No guests found. Add your first guest!'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredCustomers.map(customer => (
        <GuestListItem
          key={customer.id}
          customer={customer}
          onClick={() => onCustomerSelect(customer)}
        />
      ))}
    </div>
  );
};

export default GuestList;
