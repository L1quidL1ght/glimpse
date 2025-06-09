
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { GuestFormData } from '@/hooks/useGuestForm';

interface ImportantDatesSectionProps {
  formData: GuestFormData;
  updateField: <K extends keyof GuestFormData>(field: K, value: GuestFormData[K]) => void;
}

const ImportantDatesSection: React.FC<ImportantDatesSectionProps> = ({ formData, updateField }) => {
  const [currentDate, setCurrentDate] = React.useState({ event: '', date: '' });

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
    <>
      <Separator />
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
    </>
  );
};

export default ImportantDatesSection;
