
import React from 'react';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface ImportantNotablesProps {
  notables: string[];
}

const ImportantNotables: React.FC<ImportantNotablesProps> = ({ notables }) => {
  return (
    <Card className="p-6 bg-card border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5" style={{ color: 'hsl(var(--warning))' }} />
        <h3 className="font-semibold text-foreground">Important Notables</h3>
      </div>
      <div className="space-y-2">
        {notables.map((notable: string, index: number) => (
          <div key={index} className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-foreground">{notable}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ImportantNotables;
