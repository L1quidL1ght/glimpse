
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Users } from 'lucide-react';
import ConnectionsCombobox from './ConnectionsCombobox';

interface Connection {
  name: string;
  relationship: string;
}

interface ConnectionsManagerProps {
  connections: Connection[];
  onConnectionsChange: (connections: Connection[]) => void;
  excludeCustomerId?: string;
}

const ConnectionsManager: React.FC<ConnectionsManagerProps> = ({
  connections,
  onConnectionsChange,
  excludeCustomerId
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [relationship, setRelationship] = useState('');

  const addConnection = () => {
    if (selectedCustomer.trim() && relationship.trim()) {
      const newConnection = {
        name: selectedCustomer.trim(),
        relationship: relationship.trim()
      };
      
      // Check if connection already exists
      if (!connections.some(conn => conn.name === newConnection.name)) {
        onConnectionsChange([...connections, newConnection]);
        setSelectedCustomer('');
        setRelationship('');
      }
    }
  };

  const removeConnection = (index: number) => {
    onConnectionsChange(connections.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addConnection();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-4 h-4 text-primary" />
        <label className="text-sm font-medium text-foreground">Connections</label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <ConnectionsCombobox
          value={selectedCustomer}
          onSelect={setSelectedCustomer}
          placeholder="Select guest..."
          excludeCustomerId={excludeCustomerId}
        />
        <Input
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
          placeholder="Relationship (e.g., spouse, friend)"
          onKeyDown={handleKeyDown}
        />
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addConnection}
          disabled={!selectedCustomer.trim() || !relationship.trim()}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {connections.map((connection, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {connection.name} ({connection.relationship})
            <button
              type="button"
              onClick={() => removeConnection(index)}
              className="ml-1 hover:bg-black/20 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ConnectionsManager;
