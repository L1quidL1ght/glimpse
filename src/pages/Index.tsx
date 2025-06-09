
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, Search, Calendar, Wine } from 'lucide-react';
import Logo from '@/components/Logo';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Logo className="scale-150" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Restaurant Guest Management</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline your guest experience with our comprehensive customer database and preference tracking system.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 text-center hover:bg-accent/50 transition-colors bg-card border border-border">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Guest Profiles</h3>
            <p className="text-muted-foreground text-sm">
              Comprehensive customer profiles with contact information and preferences
            </p>
          </Card>

          <Card className="p-6 text-center hover:bg-accent/50 transition-colors bg-card border border-border">
            <Search className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Quick Search</h3>
            <p className="text-muted-foreground text-sm">
              Instantly find guest information for personalized service
            </p>
          </Card>

          <Card className="p-6 text-center hover:bg-accent/50 transition-colors bg-card border border-border">
            <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Important Dates</h3>
            <p className="text-muted-foreground text-sm">
              Track birthdays, anniversaries, and special occasions
            </p>
          </Card>

          <Card className="p-6 text-center hover:bg-accent/50 transition-colors bg-card border border-border">
            <Wine className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Preferences</h3>
            <p className="text-muted-foreground text-sm">
              Food, wine, and cocktail preferences plus allergy information
            </p>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 text-lg bg-primary hover:bg-primary/90"
          >
            Access Guest Database
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
