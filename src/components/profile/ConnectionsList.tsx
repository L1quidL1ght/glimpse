
import React from 'react';
import { Card } from '@/components/ui/card';
import { Users, User } from 'lucide-react';

interface ConnectionsListProps {
  connections: any[];
}

const ConnectionsList: React.FC<ConnectionsListProps> = ({ connections }) => {
  return (
    <Card className="p-6 mt-6 bg-card border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Connections</h3>
      </div>
      <div className="space-y-3">
        {connections.map((connection: any, index: number) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-medium text-foreground">{connection.name}</div>
              <div className="text-xs text-muted-foreground">{connection.relationship}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ConnectionsList;
