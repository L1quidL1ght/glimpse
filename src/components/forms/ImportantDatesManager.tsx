
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MonthDayPicker } from '@/components/ui/month-day-picker';
import { X, Plus, Calendar, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [selectedDate, setSelectedDate] = useState<{ month: number; day: number } | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const eventOptions = ['Birthday', 'Anniversary'];

  const addDate = () => {
    if (event.trim() && selectedDate) {
      const dateString = `${selectedDate.month.toString().padStart(2, '0')}-${selectedDate.day.toString().padStart(2, '0')}`;
      const newDate = {
        event: event.trim(),
        date: dateString
      };
      
      onDatesChange([...dates, newDate]);
      setEvent('Birthday');
      setSelectedDate(undefined);
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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

        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                formatDisplayDate(`${selectedDate.month.toString().padStart(2, '0')}-${selectedDate.day.toString().padStart(2, '0')}`)
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <MonthDayPicker
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setIsCalendarOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>

        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addDate}
          disabled={!event.trim() || !selectedDate}
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
