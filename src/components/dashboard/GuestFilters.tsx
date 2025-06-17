
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface GuestFiltersProps {
  onFilterChange: (filterType: string, value: string | null) => void;
  activeFilters: Record<string, string>;
  onClearFilters: () => void;
}

const GuestFilters: React.FC<GuestFiltersProps> = ({
  onFilterChange,
  activeFilters,
  onClearFilters
}) => {
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const tags = ['VIP', '333 Club', 'Regular', 'New', 'Frequent Diner', 'Wine Lover'];

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  const handleFilterValueChange = (filterType: string, value: string) => {
    // If the value is our "clear" value, pass null to clear the filter
    if (value === 'clear-all') {
      onFilterChange(filterType, null);
    } else {
      onFilterChange(filterType, value);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter Guests</span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="text-xs"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tag Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">By Tag</label>
          <Select
            value={activeFilters.tag || 'clear-all'}
            onValueChange={(value) => handleFilterValueChange('tag', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clear-all">All Tags</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Birthday Month Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Birthday Month</label>
          <Select
            value={activeFilters.birthdayMonth || 'clear-all'}
            onValueChange={(value) => handleFilterValueChange('birthdayMonth', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clear-all">All Months</SelectItem>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Anniversary Month Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Anniversary Month</label>
          <Select
            value={activeFilters.anniversaryMonth || 'clear-all'}
            onValueChange={(value) => handleFilterValueChange('anniversaryMonth', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clear-all">All Months</SelectItem>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {Object.entries(activeFilters).map(([key, value]) => (
            <Badge key={key} variant="secondary" className="flex items-center gap-1">
              {key === 'birthdayMonth' && `Birthday: ${months.find(m => m.value === value)?.label}`}
              {key === 'anniversaryMonth' && `Anniversary: ${months.find(m => m.value === value)?.label}`}
              {key === 'tag' && `Tag: ${value}`}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => onFilterChange(key, null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
};

export default GuestFilters;
