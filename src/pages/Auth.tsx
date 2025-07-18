import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Loader2, Building } from 'lucide-react';
import Logo from '@/components/Logo';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const validatePin = (pinValue: string) => {
    if (pinValue.length === 0) {
      setError('');
      return true;
    }
    
    if (pinValue.length !== 4) {
      setError('PIN must be exactly 4 digits');
      return false;
    }
    
    if (!/^\d{4}$/.test(pinValue)) {
      setError('PIN must contain only numbers');
      return false;
    }
    
    setError('');
    return true;
  };

  const handlePinSubmit = async () => {
    if (!validatePin(pin)) {
      toast({
        title: "Invalid PIN",
        description: error,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error: signInError } = await signIn(pin);

      if (signInError) {
        setError('Invalid PIN');
        toast({
          title: "Authentication Failed",
          description: signInError,
          variant: "destructive"
        });
        setPin(''); // Clear the PIN on error
        return;
      }

      setError('');
      toast({
        title: "Welcome",
        description: "Successfully signed in to the restaurant dashboard"
      });
      navigate('/dashboard');
    } catch (error) {
      setError('Authentication failed');
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  const handlePinChange = (value: string) => {
    setPin(value);
    // Clear error when user starts typing again
    if (error) {
      setError('');
    }
  };

  const handlePinBlur = () => {
    validatePin(pin);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && pin.length === 4) {
      handlePinSubmit();
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

        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
            <Building className="w-6 h-6" />
            Staff Access
          </CardTitle>
          <CardDescription>
            Enter your 4-digit PIN to access the restaurant management system
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="text-center">
              <label className="text-sm font-medium text-foreground mb-4 block">
                Enter PIN
              </label>
              <div className="flex justify-center">
                <div onBlur={handlePinBlur}>
                  <InputOTP
                    value={pin}
                    onChange={handlePinChange}
                    maxLength={4}
                    disabled={loading}
                    onKeyDown={handleKeyDown}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
              {error && (
                <p className="text-sm text-destructive mt-2">{error}</p>
              )}
            </div>

            <Button
              onClick={handlePinSubmit}
              disabled={loading || pin.length !== 4}
              className="w-full h-12 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Default PIN for testing: 1234</p>
          </div>
        </CardContent>

        <div className="mt-6 pt-6 border-t border-border/50 text-center">
          <p className="text-xs text-muted-foreground">
            <Shield className="w-3 h-3 inline mr-1" />
            Secure restaurant management system
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Auth;