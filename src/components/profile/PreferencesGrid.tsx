
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  UtensilsCrossed,
  Wine, 
  AlertTriangle
} from 'lucide-react';

interface PreferencesGridProps {
  customer: any;
}

const PreferencesGrid: React.FC<PreferencesGridProps> = ({ customer }) => {
  return (
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
          <UtensilsCrossed className="w-5 h-5" style={{ color: 'hsl(var(--success))' }} />
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
          <Wine className="w-5 h-5" style={{ color: 'hsl(var(--info))' }} />
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
          <Wine className="w-5 h-5" style={{ color: 'hsl(var(--info))' }} />
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
          <Wine className="w-5 h-5" style={{ color: 'hsl(var(--info))' }} />
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
  );
};

export default PreferencesGrid;
