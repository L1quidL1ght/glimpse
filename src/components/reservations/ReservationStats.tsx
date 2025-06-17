
import React from 'react';
import { Card } from '@/components/ui/card';

interface ReservationStatsProps {
  counts: {
    total: number;
    completed: number;
  };
}

const ReservationStats: React.FC<ReservationStatsProps> = ({ counts }) => {
  const upcoming = counts.total - counts.completed;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="text-center">
          <div className="text-2xl font-bold">{counts.total}</div>
          <div className="text-sm text-muted-foreground">Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{counts.completed}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{upcoming}</div>
          <div className="text-sm text-muted-foreground">Upcoming</div>
        </div>
      </div>
    </Card>
  );
};

export default ReservationStats;
