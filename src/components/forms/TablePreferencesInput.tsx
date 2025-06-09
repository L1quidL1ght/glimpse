
import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GuestFormData } from '@/hooks/useGuestForm';

interface TablePreferencesInputProps {
  formData: GuestFormData;
  updateField: <K extends keyof GuestFormData>(field: K, value: GuestFormData[K]) => void;
}

const TablePreferencesInput: React.FC<TablePreferencesInputProps> = ({ formData, updateField }) => {
  const [currentTable, setCurrentTable] = React.useState('');

  const addTablePreference = () => {
    if (currentTable.trim() && !formData.tablePreferences.includes(currentTable.trim())) {
      updateField('tablePreferences', [...formData.tablePreferences, currentTable.trim()]);
      setCurrentTable('');
    }
  };

  const removeTablePreference = (index: number) => {
    updateField('tablePreferences', formData.tablePreferences.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Table Preferences</label>
      <div className="flex gap-2">
        <Input
          value={currentTable}
          onChange={(e) => setCurrentTable(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTablePreference())}
          placeholder="Add table preference..."
          className="flex-1"
        />
        <Button type="button" variant="outline" size="sm" onClick={addTablePreference}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {formData.tablePreferences.map((table, index) => (
          <Badge key={index} variant="outline">
            {table}
            <button
              type="button"
              onClick={() => removeTablePreference(index)}
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

export default TablePreferencesInput;
