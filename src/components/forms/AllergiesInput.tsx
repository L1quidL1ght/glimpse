
import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GuestFormData } from '@/hooks/useGuestForm';

interface AllergiesInputProps {
  formData: GuestFormData;
  updateField: <K extends keyof GuestFormData>(field: K, value: GuestFormData[K]) => void;
}

const AllergiesInput: React.FC<AllergiesInputProps> = ({ formData, updateField }) => {
  const [currentAllergy, setCurrentAllergy] = React.useState('');

  const addAllergy = () => {
    if (currentAllergy.trim() && !formData.allergies.includes(currentAllergy.trim())) {
      updateField('allergies', [...formData.allergies, currentAllergy.trim()]);
      setCurrentAllergy('');
    }
  };

  const removeAllergy = (index: number) => {
    updateField('allergies', formData.allergies.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Allergies</label>
      <div className="flex gap-2">
        <Input
          value={currentAllergy}
          onChange={(e) => setCurrentAllergy(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
          placeholder="Add allergy..."
          className="flex-1"
        />
        <Button type="button" variant="outline" size="sm" onClick={addAllergy}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {formData.allergies.map((allergy, index) => (
          <Badge key={index} variant="destructive">
            {allergy}
            <button
              type="button"
              onClick={() => removeAllergy(index)}
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

export default AllergiesInput;
