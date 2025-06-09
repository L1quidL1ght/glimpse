
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Shield, Users } from 'lucide-react';
import Logo from '@/components/Logo';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [passcode, setPasscode] = useState('');
  const [loginType, setLoginType] = useState<'admin' | 'staff' | null>(null);

  // Demo passcodes - in production these would come from your backend
  const ADMIN_PASSCODE = '1234';
  const STAFF_PASSCODE = '5678';

  const handleLogin = () => {
    if (passcode.length !== 4) {
      toast({
        title: "Invalid Passcode",
        description: "Please enter a 4-digit passcode",
        variant: "destructive"
      });
      return;
    }

    if (loginType === 'admin' && passcode === ADMIN_PASSCODE) {
      toast({
        title: "Admin Access Granted",
        description: "Welcome to the admin dashboard"
      });
      navigate('/dashboard');
    } else if (loginType === 'staff' && passcode === STAFF_PASSCODE) {
      toast({
        title: "Staff Access Granted", 
        description: "Welcome to the staff dashboard"
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid passcode. Please try again.",
        variant: "destructive"
      });
      setPasscode('');
    }
  };

  const resetLogin = () => {
    setLoginType(null);
    setPasscode('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/30 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/10"></div>
      
      <Card className="w-full max-w-md p-8 bg-card/80 backdrop-blur-sm border border-border/50 shadow-2xl relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo className="scale-125" />
        </div>

        {!loginType ? (
          /* Role Selection */
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-2">Access Control</h1>
              <p className="text-muted-foreground">Select your access level</p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => setLoginType('admin')}
                className="w-full h-14 text-lg bg-primary hover:bg-primary/90 flex items-center gap-3"
              >
                <Shield className="w-5 h-5" />
                Administrator
              </Button>

              <Button
                onClick={() => setLoginType('staff')}
                variant="outline"
                className="w-full h-14 text-lg border-border hover:bg-accent/50 flex items-center gap-3"
              >
                <Users className="w-5 h-5" />
                Staff Member
              </Button>
            </div>
          </div>
        ) : (
          /* Passcode Entry */
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {loginType === 'admin' ? 'Admin' : 'Staff'} Login
              </h1>
              <p className="text-muted-foreground">Enter your 4-digit passcode</p>
            </div>

            <div className="flex justify-center">
              <InputOTP
                value={passcode}
                onChange={setPasscode}
                maxLength={4}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleLogin}
                disabled={passcode.length !== 4}
                className="w-full h-12 text-lg bg-primary hover:bg-primary/90"
              >
                Access Dashboard
              </Button>

              <Button
                onClick={resetLogin}
                variant="ghost"
                className="w-full"
              >
                ← Back to Role Selection
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Index;
