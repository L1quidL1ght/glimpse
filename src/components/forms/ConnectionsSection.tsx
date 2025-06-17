
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import CustomerAutocomplete from './CustomerAutocomplete';
import { GuestFormData } from '@/hooks/useGuestForm';

interface ConnectionsSectionProps {
  formData: GuestFormData;
  updateField: <K extends keyof GuestFormData>(field: K, value: GuestFormData[K]) => void;
}

const ConnectionsSection: React.FC<ConnectionsSectionProps> = ({ formData, updateField }) => {
  const [currentConnection, setCurrentConnection] = React.useState({ name: '', relationship: '' });

  const addConnection = () => {
    if (currentConnection.name.trim() && currentConnection.relationship.trim()) {
      updateField('connections', [...formData.connections, { ...currentConnection }]);
      setCurrentConnection({ name: '', relationship: '' });
    }
  };

  const removeConnection = (index: number) => {
    updateField('connections', formData.connections.filter((_, i) => i !== index));
  };

  return (
    <>
      <Separator />
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Connections</label>
        <div className="grid grid-cols-1 gap-2">
          <CustomerAutocomplete
            value={currentConnection.name}
            onSelect={(name) => setCurrentConnection(prev => ({ ...prev, name }))}
            placeholder="Select connection"
          />
          <Input
            value={currentConnection.relationship}
            onChange={(e) => setCurrentConnection(prev => ({ ...prev, relationship: e.target.value }))}
            placeholder="Relationship"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addConnection}
          disabled={!currentConnection.name.trim() || !currentConnection.relationship.trim()}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Connection
        </Button>
        <div className="space-y-2">
          {formData.connections.map((connection, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="text-sm">
                {connection.name} - {connection.relationship}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeConnection(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ConnectionsSection;
