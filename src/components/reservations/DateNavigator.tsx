
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Calendar as DatePicker } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, isToday, isTomorrow, addDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateNavigatorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onNavigateDate: (direction: 'prev' | 'next') => void;
  showDatePicker: boolean;
  onShowDatePickerChange: (show: boolean) => void;
}

const DateNavigator: React.FC<DateNavigatorProps> = ({
  selectedDate,
  onDateChange,
  onNavigateDate,
  showDatePicker,
  onShowDatePickerChange
}) => {
  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMMM dd, yyyy');
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateDate('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Popover open={showDatePicker} onOpenChange={onShowDatePickerChange}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="min-w-[200px]">
                  <Calendar className="w-4 h-4 mr-2" />
                  {getDateLabel(selectedDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <DatePicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      onDateChange(date);
                      onShowDatePickerChange(false);
                    }
                  }}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateDate('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isToday(selectedDate) ? "default" : "outline"}
              size="sm"
              onClick={() => onDateChange(new Date())}
            >
              Today
            </Button>
            <Button
              variant={isTomorrow(selectedDate) ? "default" : "outline"}
              size="sm"
              onClick={() => onDateChange(addDays(new Date(), 1))}
            >
              Tomorrow
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateNavigator;
