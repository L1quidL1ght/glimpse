
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Phone } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url: string | null;
  totalVisits: number;
  favoriteTable: string;
  foodPreferences: string[];
  lastVisit: string;
}

interface CustomerCardProps {
  customer: Customer;
  onClick: () => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onClick }) => {
  return (
    <Card 
      className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 bg-card border border-border"
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Profile Picture */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center overflow-hidden">
            <User className="w-10 h-10 text-primary" />
          </div>
        </div>

        {/* Name and Contact */}
        <div className="space-y-1">
          <h3 className="font-semibold text-lg text-foreground">{customer.name}</h3>
          {customer.email && <p className="text-sm text-muted-foreground">{customer.email}</p>}
          {customer.phone && (
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Phone className="w-3 h-3" />
              <span>{customer.phone}</span>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="flex gap-2 flex-wrap justify-center">
          <Badge variant="secondary" className="text-xs">
            {customer.totalVisits} visits
          </Badge>
          {customer.favoriteTable && customer.favoriteTable !== 'Not set' && (
            <Badge variant="outline" className="text-xs">
              {customer.favoriteTable}
            </Badge>
          )}
        </div>

        {/* Last Visit */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>Last visit: {new Date(customer.lastVisit).toLocaleDateString()}</span>
        </div>

        {/* Food Preferences Preview */}
        <div className="flex gap-1 flex-wrap justify-center">
          {customer.foodPreferences.slice(0, 2).map((pref, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {pref}
            </Badge>
          ))}
          {customer.foodPreferences.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{customer.foodPreferences.length - 2}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CustomerCard;
