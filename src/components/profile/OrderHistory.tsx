
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UtensilsCrossed, Calendar, Users, MapPin } from 'lucide-react';

interface OrderHistoryProps {
  visits: any[];
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ visits }) => {
  return (
    <Card className="p-6 bg-card border border-border">
      <div className="flex items-center gap-2 mb-4">
        <UtensilsCrossed className="w-5 h-5" style={{ color: 'hsl(var(--success))' }} />
        <h3 className="font-semibold text-foreground">Visit & Order History</h3>
      </div>
      <div className="space-y-4">
        {visits.map((visit: any, index: number) => (
          <div key={index} className="p-4 bg-muted rounded-lg">
            {/* Visit Info Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">
                    {new Date(visit.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Party of {visit.party}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {visit.table}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Order Details */}
            {visit.orders && (
              <div className="space-y-3 mb-3">
                {visit.orders.appetizers && visit.orders.appetizers.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">Appetizers</div>
                    <div className="flex flex-wrap gap-1">
                      {visit.orders.appetizers.map((item: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs bg-muted/50">{item}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {visit.orders.entrees && visit.orders.entrees.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">Main Entrees</div>
                    <div className="flex flex-wrap gap-1">
                      {visit.orders.entrees.map((item: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs bg-muted/50">{item}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {visit.orders.cocktails && visit.orders.cocktails.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">Cocktails</div>
                    <div className="flex flex-wrap gap-1">
                      {visit.orders.cocktails.map((item: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs bg-muted/50">{item}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {visit.orders.desserts && visit.orders.desserts.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">Desserts</div>
                    <div className="flex flex-wrap gap-1">
                      {visit.orders.desserts.map((item: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs bg-muted/50">{item}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Visit Notes */}
            {visit.notes && (
              <div className="text-sm text-muted-foreground pt-2 border-t border-border">
                <span className="font-medium">Notes: </span>{visit.notes}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default OrderHistory;
