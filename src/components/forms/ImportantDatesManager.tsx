import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const [event, setEvent] = useState('Birthday');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('');

  const eventOptions = ['Birthday', 'Anniversary'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate days 1-31
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  const addDate = () => {
    if (event.trim() && selectedMonth && selectedDay) {
      const monthIndex = months.indexOf(selectedMonth) + 1;
      const dateString = `${monthIndex.toString().padStart(2, '0')}-${selectedDay.padStart(2, '0')}`;
      const newDate = {
        event: event.trim(),
        date: dateString
      };
      
      onDatesChange([...dates, newDate]);
      setEvent('Birthday');
      setSelectedMonth('');
      setSelectedDay('');
    }
  };

  const removeDate = (index: number) => {
    onDatesChange(dates.filter((_, i) => i !== index));
  };

  const formatDisplayDate = (dateString: string) => {
    const [month, day] = dateString.split('-');
    const date = new Date(2000, parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-primary" />
        <label className="text-sm font-medium text-foreground">Important Dates</label>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Select value={event} onValueChange={setEvent}>
          <SelectTrigger>
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent>
            {eventOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger>
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedDay} onValueChange={setSelectedDay}>
          <SelectTrigger>
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {days.map((day) => (
              <SelectItem key={day} value={day}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addDate}
          disabled={!event.trim() || !selectedMonth || !selectedDay}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {dates.map((importantDate, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {importantDate.event} - {formatDisplayDate(importantDate.date)}
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