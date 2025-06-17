
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, UserCog } from 'lucide-react';
import Logo from '@/components/Logo';

interface DashboardHeaderProps {
  onAddGuest: () => void;
  isAdmin: boolean;
  onAdminLogin?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  onAddGuest, 
  isAdmin,
  onAdminLogin 
}) => {
  return (
    <div className="flex items-center justify-between">
      <Logo />
      <div className="flex items-center gap-2">
        {!isAdmin && onAdminLogin && (
          <Button
            variant="outline"
            onClick={onAdminLogin}
            className="flex items-center gap-2"
          >
            <UserCog className="w-4 h-4" />
            Admin Access
          </Button>
        )}
        <Button 
          onClick={onAddGuest}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Guest
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
