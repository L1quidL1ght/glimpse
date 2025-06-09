
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Calendar } from 'lucide-react';

interface ImportantDate {
  event: string;
  date: string;
}

interface ImportantDatesManagerProps {
  dates: ImportantDate[];
  onDatesChange: (dates: ImportantDate[]) => void;
}

const ImportantDatesManager: React.FC<ImportantDatesManagerProps> = ({
  dates,
  onDatesChange
}) => {
  const [event, setEvent] = useState('');
  const [date, setDate] = useState('');

  const addDate = () => {
    if (event.trim() && date.trim()) {
      const newDate = {
        event: event.trim(),
        date: date.trim()
      };
      
      onDatesChange([...dates, newDate]);
      setEvent('');
      setDate('');
    }
  };

  const removeDate = (index: number) => {
    onDatesChange(dates.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-primary" />
        <label className="text-sm font-medium text-foreground">Important Dates</label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Input
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          placeholder="Event (e.g., Birthday, Anniversary)"
        />
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Button type="button" variant="outline" size="sm" onClick={addDate}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {dates.map((importantDate, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {importantDate.event} - {new Date(importantDate.date).toLocaleDateString()}
            <button
              type="button"
              onClick={() => removeDate(index)}
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

export default ImportantDatesManager;
