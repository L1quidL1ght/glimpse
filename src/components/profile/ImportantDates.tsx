
import React from 'react';
import { Card } from '@/components/ui/card';
import { Heart, Calendar } from 'lucide-react';

interface ImportantDatesProps {
  importantDates: any[];
}

const ImportantDates: React.FC<ImportantDatesProps> = ({ importantDates }) => {
  return (
    <Card className="p-6 bg-card border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Important Dates</h3>
      </div>
      <div className="space-y-3">
        {importantDates.map((date: any, index: number) => (
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
  );
};

export default ImportantDates;
