
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  lastVisit: string;
  totalVisits: number;
  favoriteTable: string;
  foodPreferences: string[];
}

interface GuestListItemProps {
  customer: Customer;
  onClick: () => void;
}

const GuestListItem: React.FC<GuestListItemProps> = ({ customer, onClick }) => {
  return (
    <Card 
      className="p-4 cursor-pointer hover:bg-accent/50 transition-all duration-200 bg-card border border-border group"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        {/* Profile Picture */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-primary" />
        </div>

        {/* Name and Tag */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
            {customer.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              {customer.totalVisits} visits
            </Badge>
          </div>
        </div>

        {/* Arrow indicator */}
        <div className="text-muted-foreground group-hover:text-primary transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Card>
  );
};

export default GuestListItem;
