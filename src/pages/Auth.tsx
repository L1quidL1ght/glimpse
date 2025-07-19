import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Loader2, Building, Delete } from 'lucide-react';
import Logo from '@/components/Logo';

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

  const handleNumberPress = (num: string) => {
    if (pin.length < 4 && !loading) {
      const newPin = pin + num;
      setPin(newPin);
      if (error) {
        setError('');
      }
      // Auto-submit when 4 digits are entered
      if (newPin.length === 4) {
        setTimeout(() => handlePinSubmit(), 100);
      }
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0 && !loading) {
      setPin(pin.slice(0, -1));
      if (error) {
        setError('');
      }
    }
  };

  const handleClear = () => {
    if (!loading) {
      setPin('');
      if (error) {
        setError('');
      }
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
          <div className="space-y-6">
            {/* PIN Display */}
            <div className="text-center">
              <label className="text-sm font-medium text-foreground mb-4 block">
                Enter PIN
              </label>
              <div className="flex justify-center gap-3 mb-6">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="w-12 h-12 border border-input rounded-md flex items-center justify-center bg-background text-lg font-mono"
                  >
                    {pin[index] ? '•' : ''}
                  </div>
                ))}
              </div>
              {error && (
                <p className="text-sm text-destructive mt-2">{error}</p>
              )}
            </div>

            {/* Custom Number Pad */}
            <div className="flex flex-col items-center space-y-4">
              <div className="grid grid-cols-3 gap-3 max-w-xs w-full">
                {/* Numbers 1-9 */}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <Button
                    key={num}
                    onClick={() => handleNumberPress(num.toString())}
                    disabled={loading || pin.length >= 4}
                    variant="outline"
                    className="h-14 text-xl font-semibold rounded-xl hover:bg-accent hover:scale-105 transition-all duration-200 touch-manipulation"
                    inputMode="numeric"
                  >
                    {num}
                  </Button>
                ))}
                
                {/* Bottom row: Clear, 0, Backspace */}
                <Button
                  onClick={handleClear}
                  disabled={loading}
                  variant="outline"
                  className="h-14 text-sm font-medium rounded-xl hover:bg-accent hover:scale-105 transition-all duration-200 touch-manipulation"
                >
                  Clear
                </Button>
                
                <Button
                  onClick={() => handleNumberPress('0')}
                  disabled={loading || pin.length >= 4}
                  variant="outline"
                  className="h-14 text-xl font-semibold rounded-xl hover:bg-accent hover:scale-105 transition-all duration-200 touch-manipulation"
                  inputMode="numeric"
                >
                  0
                </Button>
                
                <Button
                  onClick={handleBackspace}
                  disabled={loading || pin.length === 0}
                  variant="outline"
                  className="h-14 text-sm font-medium rounded-xl hover:bg-accent hover:scale-105 transition-all duration-200 touch-manipulation"
                >
                  <Delete className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Sign In Button */}
            <Button
              onClick={handlePinSubmit}
              disabled={loading || pin.length !== 4}
              className="w-full h-12 text-lg mt-6"
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
        </CardContent>

        <div className="mt-6 pt-6 border-t border-border/50 text-center">
          <p className="text-xs text-muted-foreground">
            Created with ♥️ + 🍺 by Lorenzo
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Auth;