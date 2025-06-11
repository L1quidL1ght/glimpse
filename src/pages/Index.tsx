import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Shield } from 'lucide-react';
import Logo from '@/components/Logo';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [passcode, setPasscode] = useState('');

  // Admin passcode - concealed from view
  const ADMIN_PASSCODE = '1234';

  const handleLogin = () => {
    if (passcode.length !== 4) {
      toast({
        title: "Invalid Passcode",
        description: "Please enter a 4-digit passcode",
        variant: "destructive"
      });
      return;
    }

    if (passcode === ADMIN_PASSCODE) {
      toast({
        title: "Admin Access Granted",
        description: "Welcome to the admin dashboard"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/30 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/10"></div>
      
      <Card className="w-full max-w-md p-8 bg-card/80 backdrop-blur-sm border border-border/50 shadow-2xl relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo className="scale-125" />
        </div>

        {/* Admin Login */}
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
              <Shield className="w-6 h-6" />
              Admin Access
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

          <Button
            onClick={handleLogin}
            disabled={passcode.length !== 4}
            className="w-full h-12 text-lg bg-primary hover:bg-primary/90"
          >
            Access Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Index;
