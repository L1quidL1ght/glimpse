
import React from 'react';
import { Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';

interface DashboardHeaderProps {
  onAddGuest: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onAddGuest }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <Logo />
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon">
          <Settings className="w-4 h-4" />
        </Button>
        <Button 
          size="icon" 
          className="bg-primary hover:bg-primary/90"
          onClick={onAddGuest}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
