
import React from 'react';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface VisitHistoryProps {
  visits: any[];
}

const VisitHistory: React.FC<VisitHistoryProps> = ({ visits }) => {
  return (
    <Card className="p-6 bg-card border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Previous Visits</h3>
      </div>
      <div className="space-y-3">
        {visits.map((visit: any, index: number) => (
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
  );
};

export default VisitHistory;
