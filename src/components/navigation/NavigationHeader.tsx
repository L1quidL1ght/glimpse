
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus } from 'lucide-react';
import Logo from '@/components/Logo';

interface NavigationHeaderProps {
  onBack?: () => void;
  showBackButton?: boolean;
  title?: string;
  onAddGuest?: () => void;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({ 
  onBack, 
  showBackButton = false,
  title,
  onAddGuest
}) => {
  return (
    <div className="flex items-center justify-between py-6 h-20">
      <div className="flex items-center gap-4">
        {showBackButton && onBack && (
          <Button variant="outline" onClick={onBack} size="icon" className="h-10 w-10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <div className="text-2xl font-bold">
          <Logo />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {onAddGuest && (
          <Button
            onClick={onAddGuest}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white h-10 px-4 text-base font-semibold"
          >
            <UserPlus className="w-5 h-5" />
            Add Guest
          </Button>
        )}
      </div>
    </div>
  );
};

export default NavigationHeader;
