
import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GuestFormData } from '@/hooks/useGuestForm';

interface GuestFormFieldsProps {
  formData: GuestFormData;
  updateField: <K extends keyof GuestFormData>(field: K, value: GuestFormData[K]) => void;
}

const GuestFormFields: React.FC<GuestFormFieldsProps> = ({ formData, updateField }) => {
  const [currentTag, setCurrentTag] = React.useState('');
  const [currentTable, setCurrentTable] = React.useState('');
  const [currentAllergy, setCurrentAllergy] = React.useState('');
  const [currentNotable, setCurrentNotable] = React.useState('');

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      updateField('tags', [...formData.tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (index: number) => {
    updateField('tags', formData.tags.filter((_, i) => i !== index));
  };

  const addTablePreference = () => {
    if (currentTable.trim() && !formData.tablePreferences.includes(currentTable.trim())) {
      updateField('tablePreferences', [...formData.tablePreferences, currentTable.trim()]);
      setCurrentTable('');
    }
  };

  const removeTablePreference = (index: number) => {
    updateField('tablePreferences', formData.tablePreferences.filter((_, i) => i !== index));
  };

  const addAllergy = () => {
    if (currentAllergy.trim() && !formData.allergies.includes(currentAllergy.trim())) {
      updateField('allergies', [...formData.allergies, currentAllergy.trim()]);
      setCurrentAllergy('');
    }
  };

  const removeAllergy = (index: number) => {
    updateField('allergies', formData.allergies.filter((_, i) => i !== index));
  };

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
    <div className="space-y-4">
      {/* Basic Information */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Name *</label>
        <Input
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="Guest name"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Email</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="guest@email.com"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Phone</label>
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          placeholder="(555) 123-4567"
        />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Tags</label>
        <div className="flex gap-2">
          <Input
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Add tag..."
            className="flex-1"
          />
          <Button type="button" variant="outline" size="sm" onClick={addTag}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-1 hover:bg-black/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Table Preferences */}
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

      {/* Allergies */}
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

      {/* Important Notables */}
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
    </div>
  );
};

export default GuestFormFields;
