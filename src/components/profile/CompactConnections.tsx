
import React from 'react';
import { Card } from '@/components/ui/card';
import { Users, User, Crown, Star } from 'lucide-react';

interface CompactConnectionsProps {
  connections: any[];
  allCustomers: any[];
}

const CompactConnections: React.FC<CompactConnectionsProps> = ({ connections, allCustomers }) => {
  const getCustomerTags = (connectionName: string) => {
    const customer = allCustomers.find(c => c.name === connectionName);
    return customer?.tags || [];
  };

  return (
    <Card className="p-4 bg-card border border-border">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-4 h-4 text-primary" />
        <h3 className="font-medium text-foreground">Connections</h3>
      </div>
      <div className="space-y-2">
        {connections.map((connection: any, index: number) => {
          const tags = getCustomerTags(connection.name);
          const has333Club = tags.includes('333 Club');
          const hasVIP = tags.includes('VIP');
          
          return (
            <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                <User className="w-3 h-3 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-foreground truncate">{connection.name}</span>
                  {has333Club && <Crown className="w-3 h-3" style={{ color: 'gold' }} />}
                  {hasVIP && <Star className="w-3 h-3" style={{ color: 'gold' }} />}
                </div>
                <div className="text-xs text-muted-foreground">{connection.relationship}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default CompactConnections;
