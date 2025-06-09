
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Calendar } from 'lucide-react';

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
            <div>{customer.email}</div>
            <div>{customer.phone}</div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-2 flex-wrap justify-center">
          <Badge variant="secondary" className="bg-accent text-accent-foreground">VIP</Badge>
          <Badge variant="outline" className="border-primary/30 text-primary">Regular</Badge>
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
