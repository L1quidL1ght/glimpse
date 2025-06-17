
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MonthDayPicker } from '@/components/ui/month-day-picker';
import { Plus, X, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GuestFormData } from '@/hooks/useGuestForm';

interface ImportantDatesSectionProps {
  formData: GuestFormData;
  updateField: <K extends keyof GuestFormData>(field: K, value: GuestFormData[K]) => void;
}

const ImportantDatesSection: React.FC<ImportantDatesSectionProps> = ({ formData, updateField }) => {
  const [currentDate, setCurrentDate] = React.useState({ 
    event: 'Birthday', 
    date: undefined as { month: number; day: number } | undefined 
  });
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  const eventOptions = ['Birthday', 'Anniversary'];

  const addImportantDate = () => {
    if (currentDate.event.trim() && currentDate.date) {
      const dateString = `${currentDate.date.month.toString().padStart(2, '0')}-${currentDate.date.day.toString().padStart(2, '0')}`;
      updateField('importantDates', [...formData.importantDates, { 
        event: currentDate.event, 
        date: dateString 
      }]);
      setCurrentDate({ event: 'Birthday', date: undefined });
    }
  };

  const removeImportantDate = (index: number) => {
    updateField('importantDates', formData.importantDates.filter((_, i) => i !== index));
  };

  const formatDisplayDate = (dateString: string) => {
    const [month, day] = dateString.split('-');
    const date = new Date(2000, parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  return (
    <>
      <Separator />
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Important Dates</label>
        <div className="grid grid-cols-2 gap-2">
          <Select value={currentDate.event} onValueChange={(value) => setCurrentDate(prev => ({ ...prev, event: value }))}>
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
                  !currentDate.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {currentDate.date ? (
                  formatDisplayDate(`${currentDate.date.month.toString().padStart(2, '0')}-${currentDate.date.day.toString().padStart(2, '0')}`)
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <MonthDayPicker
                selected={currentDate.date}
                onSelect={(date) => {
                  setCurrentDate(prev => ({ ...prev, date }));
                  setIsCalendarOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addImportantDate}
          disabled={!currentDate.event.trim() || !currentDate.date}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Important Date
        </Button>
        <div className="space-y-2">
          {formData.importantDates.map((date, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="text-sm">
                {date.event} - {formatDisplayDate(date.date)}
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
