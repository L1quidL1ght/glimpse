
import React from 'react';
import { Card } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface SpecialNotesProps {
  notes: string;
}

const SpecialNotes: React.FC<SpecialNotesProps> = ({ notes }) => {
  return (
    <Card className="p-6 bg-card border border-border">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Special Notes</h3>
      </div>
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-muted-foreground leading-relaxed">{notes}</p>
      </div>
    </Card>
  );
};

export default SpecialNotes;
