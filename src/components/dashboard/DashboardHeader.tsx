
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/Logo';

interface DashboardHeaderProps {
  onAddGuest: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  onAddGuest
}) => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);

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
    <div className="flex items-center justify-between">
      <Logo />
      <div className="flex items-center gap-2">
        <Button 
          onClick={onAddGuest}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Guest
        </Button>
        <Button
          variant="outline"
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

export default DashboardHeader;
