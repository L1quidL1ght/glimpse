
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, Search, Calendar, Wine } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Restaurant Guest Management</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline your guest experience with our comprehensive customer database and preference tracking system.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Guest Profiles</h3>
            <p className="text-muted-foreground text-sm">
              Comprehensive customer profiles with contact information and preferences
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Search className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Quick Search</h3>
            <p className="text-muted-foreground text-sm">
              Instantly find guest information for personalized service
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Important Dates</h3>
            <p className="text-muted-foreground text-sm">
              Track birthdays, anniversaries, and special occasions
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
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
            className="px-8 py-4 text-lg"
          >
            Access Guest Database
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
