import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Building, Users, ShieldCheck } from 'lucide-react';
import Logo from '@/components/Logo';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/30 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/10"></div>
      
      <Card className="w-full max-w-md p-8 bg-card/80 backdrop-blur-sm border border-border/50 shadow-2xl relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo className="scale-125" />
        </div>

        {/* Welcome Content */}
        <div className="space-y-6 text-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
              <Building className="w-8 h-8" />
              Restaurant Management
            </h1>
            <p className="text-muted-foreground text-lg">
              Secure guest management system for restaurant staff
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 my-8">
            <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border border-border/30">
              <Users className="w-6 h-6 text-primary" />
              <div className="text-left">
                <h3 className="font-semibold">Guest Management</h3>
                <p className="text-sm text-muted-foreground">Track preferences, visits, and reservations</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border border-border/30">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <div className="text-left">
                <h3 className="font-semibold">Secure Access</h3>
                <p className="text-sm text-muted-foreground">Role-based authentication for staff</p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => navigate('/auth')}
            className="w-full h-12 text-lg"
          >
            Staff Login
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Index;
