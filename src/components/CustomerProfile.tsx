
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Calendar, 
  Users, 
  Wine, 
  UtensilsCrossed,
  AlertTriangle,
  Heart,
  Clock,
  MapPin,
  FileText
} from 'lucide-react';
import Logo from '@/components/Logo';

interface CustomerProfileProps {
  customer: any;
  onBack: () => void;
  allCustomers: any[];
}

const CustomerProfile: React.FC<CustomerProfileProps> = ({ customer, onBack, allCustomers }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack} size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Logo />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-card border border-border">
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Profile Picture */}
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                  <User className="w-12 h-12 text-primary" />
                </div>

                {/* Name and Basic Info */}
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-foreground">{customer.name}</h2>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{customer.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-lg font-semibold text-foreground">{customer.totalVisits}</div>
                    <div className="text-xs text-muted-foreground">Total Visits</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-sm font-semibold text-foreground">{customer.favoriteTable}</div>
                    <div className="text-xs text-muted-foreground">Favorite Table</div>
                  </div>
                </div>

                {/* Last Visit */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Last visit: {new Date(customer.lastVisit).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>

            {/* Connections */}
            <Card className="p-6 mt-6 bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Connections</h3>
              </div>
              <div className="space-y-3">
                {customer.connections.map((connection: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{connection.name}</div>
                      <div className="text-xs text-muted-foreground">{connection.relationship}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Preferences Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Table Preferences */}
              <Card className="p-6 bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Table Preferences</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {customer.tablePreferences?.map((pref: string, index: number) => (
                    <Badge key={index} variant="outline">{pref}</Badge>
                  ))}
                </div>
              </Card>

              {/* Food Preferences */}
              <Card className="p-6 bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <UtensilsCrossed className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Food Preferences</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {customer.foodPreferences.map((pref: string, index: number) => (
                    <Badge key={index} variant="secondary">{pref}</Badge>
                  ))}
                </div>
              </Card>

              {/* Wine Preferences */}
              <Card className="p-6 bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Wine className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Wine Preferences</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {customer.winePreferences.map((wine: string, index: number) => (
                    <Badge key={index} variant="outline">{wine}</Badge>
                  ))}
                </div>
              </Card>

              {/* Spirits Preferences */}
              <Card className="p-6 bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Wine className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Spirits Preferences</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {customer.spiritsPreferences?.map((spirit: string, index: number) => (
                    <Badge key={index} variant="outline">{spirit}</Badge>
                  ))}
                </div>
              </Card>

              {/* Cocktail Preferences */}
              <Card className="p-6 bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Wine className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Cocktail Preferences</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {customer.cocktailPreferences.map((cocktail: string, index: number) => (
                    <Badge key={index} variant="outline">{cocktail}</Badge>
                  ))}
                </div>
              </Card>

              {/* Allergies */}
              <Card className="p-6 bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <h3 className="font-semibold text-foreground">Allergies</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {customer.allergies.map((allergy: string, index: number) => (
                    <Badge key={index} variant="destructive">{allergy}</Badge>
                  ))}
                </div>
              </Card>
            </div>

            {/* Special Notes */}
            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Special Notes</h3>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-muted-foreground leading-relaxed">{customer.notes}</p>
              </div>
            </Card>

            {/* Important Dates */}
            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Important Dates</h3>
              </div>
              <div className="space-y-3">
                {customer.importantDates.map((date: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium text-foreground">{date.event}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(date.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Visit History */}
            <Card className="p-6 bg-card border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Previous Visits</h3>
              </div>
              <div className="space-y-3">
                {customer.visits.map((visit: any, index: number) => (
                  <div key={index} className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-foreground">
                        {new Date(visit.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Party of {visit.party} • {visit.table}
                      </div>
                    </div>
                    {visit.notes && (
                      <div className="text-sm text-muted-foreground">{visit.notes}</div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
