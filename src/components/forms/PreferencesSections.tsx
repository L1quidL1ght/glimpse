
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import PreferenceInput from './PreferenceInput';
import CustomerAutocomplete from './CustomerAutocomplete';
import { GuestFormData } from '@/hooks/useGuestForm';
import { usePreferenceOptions } from '@/hooks/usePreferenceOptions';

interface PreferencesSectionsProps {
  formData: GuestFormData;
  updateField: <K extends keyof GuestFormData>(field: K, value: GuestFormData[K]) => void;
}

const PreferencesSections: React.FC<PreferencesSectionsProps> = ({ formData, updateField }) => {
  const { foodOptions, wineOptions, cocktailOptions, spiritsOptions } = usePreferenceOptions();
  
  const [currentConnection, setCurrentConnection] = React.useState({ name: '', relationship: '' });
  const [currentDate, setCurrentDate] = React.useState({ event: '', date: '' });

  const addConnection = () => {
    if (currentConnection.name.trim() && currentConnection.relationship.trim()) {
      updateField('connections', [...formData.connections, { ...currentConnection }]);
      setCurrentConnection({ name: '', relationship: '' });
    }
  };

  const removeConnection = (index: number) => {
    updateField('connections', formData.connections.filter((_, i) => i !== index));
  };

  const addImportantDate = () => {
    if (currentDate.event.trim() && currentDate.date.trim()) {
      updateField('importantDates', [...formData.importantDates, { ...currentDate }]);
      setCurrentDate({ event: '', date: '' });
    }
  };

  const removeImportantDate = (index: number) => {
    updateField('importantDates', formData.importantDates.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <Separator />

      {/* Food Preferences */}
      <PreferenceInput
        label="Food Preferences"
        preferences={formData.foodPreferences}
        onChange={(prefs) => updateField('foodPreferences', prefs)}
        options={foodOptions}
      />

      <Separator />

      {/* Wine Preferences */}
      <PreferenceInput
        label="Wine Preferences"
        preferences={formData.winePreferences}
        onChange={(prefs) => updateField('winePreferences', prefs)}
        options={wineOptions}
      />

      <Separator />

      {/* Cocktail Preferences */}
      <PreferenceInput
        label="Cocktail Preferences"
        preferences={formData.cocktailPreferences}
        onChange={(prefs) => updateField('cocktailPreferences', prefs)}
        options={cocktailOptions}
      />

      <Separator />

      {/* Spirits Preferences */}
      <PreferenceInput
        label="Spirits Preferences"
        preferences={formData.spiritsPreferences}
        onChange={(prefs) => updateField('spiritsPreferences', prefs)}
        options={spiritsOptions}
      />

      <Separator />

      {/* Connections */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Connections</label>
        <div className="grid grid-cols-1 gap-2">
          <CustomerAutocomplete
            value={currentConnection.name}
            onChange={(name) => setCurrentConnection(prev => ({ ...prev, name }))}
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

      <Separator />

      {/* Important Dates */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Important Dates</label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            value={currentDate.event}
            onChange={(e) => setCurrentDate(prev => ({ ...prev, event: e.target.value }))}
            placeholder="Event name"
          />
          <Input
            type="date"
            value={currentDate.date}
            onChange={(e) => setCurrentDate(prev => ({ ...prev, date: e.target.value }))}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addImportantDate}
          disabled={!currentDate.event.trim() || !currentDate.date.trim()}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Important Date
        </Button>
        <div className="space-y-2">
          {formData.importantDates.map((date, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="text-sm">
                {date.event} - {new Date(date.date).toLocaleDateString()}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeImportantDate(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Notes</label>
        <Textarea
          value={formData.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="Additional notes about the guest..."
          rows={3}
        />
      </div>
    </div>
  );
};

export default PreferencesSections;
