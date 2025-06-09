
import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GuestFormData } from '@/hooks/useGuestForm';

interface ImportantNotablesInputProps {
  formData: GuestFormData;
  updateField: <K extends keyof GuestFormData>(field: K, value: GuestFormData[K]) => void;
}

const ImportantNotablesInput: React.FC<ImportantNotablesInputProps> = ({ formData, updateField }) => {
  const [currentNotable, setCurrentNotable] = React.useState('');

  const addNotable = () => {
    if (currentNotable.trim() && !formData.importantNotables.includes(currentNotable.trim())) {
      updateField('importantNotables', [...formData.importantNotables, currentNotable.trim()]);
      setCurrentNotable('');
    }
  };

  const removeNotable = (index: number) => {
    updateField('importantNotables', formData.importantNotables.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Important Notables</label>
      <div className="flex gap-2">
        <Input
          value={currentNotable}
          onChange={(e) => setCurrentNotable(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addNotable())}
          placeholder="Add notable..."
          className="flex-1"
        />
        <Button type="button" variant="outline" size="sm" onClick={addNotable}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {formData.importantNotables.map((notable, index) => (
          <Badge key={index} variant="default">
            {notable}
            <button
              type="button"
              onClick={() => removeNotable(index)}
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

export default ImportantNotablesInput;
