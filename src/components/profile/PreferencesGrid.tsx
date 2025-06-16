
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, UtensilsCrossed, Wine, AlertTriangle } from 'lucide-react';

interface PreferenceItem {
  value: string;
  isGolden: boolean;
}

interface PreferencesGridProps {
  customer: any;
}

const PreferencesGrid: React.FC<PreferencesGridProps> = ({
  customer
}) => {
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
            <Badge key={index} variant="outline" className="bg-muted/50 border-muted">
              {pref}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Food Preferences */}
      <Card className="p-6 bg-card border border-border">
        <div className="flex items-center gap-2 mb-4">
          <UtensilsCrossed className="w-5 h-5" style={{
            color: 'hsl(var(--success))'
          }} />
          <h3 className="font-semibold text-foreground">Food Preferences</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {customer.foodPreferences?.map((pref: PreferenceItem | string, index: number) => (
            <Badge 
              key={index} 
              variant={typeof pref === 'object' && pref.isGolden ? "default" : "secondary"}
              className={typeof pref === 'object' && pref.isGolden ? "bg-yellow-500 text-white" : "bg-muted/50"}
            >
              {typeof pref === 'object' ? pref.value : pref}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Wine Preferences */}
      <Card className="p-6 bg-card border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Wine className="w-5 h-5" style={{
            color: 'hsl(var(--info))'
          }} />
          <h3 className="font-semibold text-foreground">Wine Preferences</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {customer.winePreferences?.map((wine: PreferenceItem | string, index: number) => (
            <Badge 
              key={index} 
              variant={typeof wine === 'object' && wine.isGolden ? "default" : "outline"}
              className={typeof wine === 'object' && wine.isGolden ? "bg-yellow-500 text-white" : "bg-muted/50 border-muted"}
            >
              {typeof wine === 'object' ? wine.value : wine}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Spirits Preferences */}
      <Card className="p-6 bg-card border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Wine className="w-5 h-5" style={{
            color: 'hsl(var(--info))'
          }} />
          <h3 className="font-semibold text-foreground">Spirits Preferences</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {customer.spiritsPreferences?.map((spirit: PreferenceItem | string, index: number) => (
            <Badge 
              key={index} 
              variant={typeof spirit === 'object' && spirit.isGolden ? "default" : "outline"}
              className={typeof spirit === 'object' && spirit.isGolden ? "bg-yellow-500 text-white" : "bg-muted/50 border-muted"}
            >
              {typeof spirit === 'object' ? spirit.value : spirit}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Cocktail Preferences */}
      <Card className="p-6 bg-card border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Wine className="w-5 h-5" style={{
            color: 'hsl(var(--info))'
          }} />
          <h3 className="font-semibold text-foreground">Cocktail Preferences</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {customer.cocktailPreferences?.map((cocktail: PreferenceItem | string, index: number) => (
            <Badge 
              key={index} 
              variant={typeof cocktail === 'object' && cocktail.isGolden ? "default" : "outline"}
              className={typeof cocktail === 'object' && cocktail.isGolden ? "bg-yellow-500 text-white" : "border-muted bg-slate-700 rounded-bl-sm"}
            >
              {typeof cocktail === 'object' ? cocktail.value : cocktail}
            </Badge>
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
          {customer.allergies?.map((allergy: string, index: number) => (
            <Badge key={index} variant="destructive">
              {allergy}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default PreferencesGrid;
