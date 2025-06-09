import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, LogOut, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
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
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSwitchUser = () => {
    if (onBack) {
      onBack();
    } else {
      // Navigate to main directory
      window.location.href = '/dashboard';
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const { error } = await signOut();
      if (error) throw error;
      
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out"
      });
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        {showBackButton && onBack && (
          <Button variant="outline" onClick={onBack} size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <Logo />
      </div>
      
      <div className="flex items-center gap-2">
        {onAddGuest && (
          <Button
            onClick={onAddGuest}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <UserPlus className="w-4 h-4" />
            Add Guest
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={handleSwitchUser}
          className="flex items-center gap-2"
        >
          <Users className="w-4 h-4" />
          Switch User
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          {isSigningOut ? 'Signing Out...' : 'Log Out'}
        </Button>
      </div>
    </div>
  );
};

export default NavigationHeader;
