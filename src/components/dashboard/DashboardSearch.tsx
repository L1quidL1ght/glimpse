
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DashboardSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const DashboardSearch: React.FC<DashboardSearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        placeholder="Search guests..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 bg-card border-border"
      />
    </div>
  );
};

export default DashboardSearch;
