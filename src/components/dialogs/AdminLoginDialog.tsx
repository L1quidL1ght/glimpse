
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface AdminLoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdminLogin: () => void;
}

const AdminLoginDialog: React.FC<AdminLoginDialogProps> = ({
  open,
  onOpenChange,
  onAdminLogin
}) => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Updated admin PIN
  const ADMIN_PIN = '3333';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      if (pin === ADMIN_PIN) {
        onAdminLogin();
        onOpenChange(false);
        setPin('');
        toast({
          title: "Success",
          description: "Admin access granted",
        });
      } else {
        toast({
          title: "Error",
          description: "Invalid PIN",
          variant: "destructive",
        });
      }
      setLoading(false);
    }, 500);
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Admin Login</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Enter 4-digit PIN</label>
            <Input
              type="password"
              value={pin}
              onChange={handlePinChange}
              placeholder="••••"
              maxLength={4}
              className="text-center text-xl tracking-widest"
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={pin.length !== 4 || loading}
              className="flex-1"
            >
              {loading ? 'Verifying...' : 'Login'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLoginDialog;
