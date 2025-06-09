
import React from 'react';
import { Card } from '@/components/ui/card';
import { User, Phone, Calendar } from 'lucide-react';

interface ProfileCardProps {
  customer: any;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ customer }) => {
  return (
    <Card className="p-6 bg-card border border-border">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Profile Picture */}
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
          <User className="w-12 h-12 text-primary" />
        </div>

        {/* Name and Basic Info */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">{customer.name}</h2>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <User className="w-4 h-4" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{customer.phone}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-lg font-semibold text-foreground">{customer.totalVisits}</div>
            <div className="text-xs text-muted-foreground">Total Visits</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-sm font-semibold text-foreground">{customer.favoriteTable}</div>
            <div className="text-xs text-muted-foreground">Favorite Table</div>
          </div>
        </div>

        {/* Last Visit */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Last visit: {new Date(customer.lastVisit).toLocaleDateString()}</span>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
