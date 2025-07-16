
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Logo from '@/components/Logo';
import UserMenu from './UserMenu';

interface DashboardHeaderProps {
  onAddGuest: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  onAddGuest
}) => {

  return (
    <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <Logo />
          <div>
            <h1 className="text-xl font-semibold">Guest Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage your restaurant guests</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            onClick={onAddGuest}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Guest
          </Button>
          <UserMenu />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
