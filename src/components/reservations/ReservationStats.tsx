
import React from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ReservationStatsProps {
  counts: {
    total: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    no_show: number;
  };
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

const ReservationStats: React.FC<ReservationStatsProps> = ({
  counts,
  statusFilter,
  onStatusFilterChange
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      <Card className="p-4">
        <div className="text-center">
          <div className="text-2xl font-bold">{counts.total}</div>
          <div className="text-sm text-muted-foreground">Total</div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{counts.confirmed}</div>
          <div className="text-sm text-muted-foreground">Confirmed</div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{counts.completed}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{counts.cancelled}</div>
          <div className="text-sm text-muted-foreground">Cancelled</div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">{counts.no_show}</div>
          <div className="text-sm text-muted-foreground">No Show</div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="text-center">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="no_show">No Show</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>
    </div>
  );
};

export default ReservationStats;
