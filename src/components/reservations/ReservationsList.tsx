
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { type Reservation } from '@/hooks/useReservations';
import ReservationCard from './ReservationCard';
import { format } from 'date-fns';

interface ReservationsListProps {
  reservations: Reservation[];
  selectedDate: Date;
  statusFilter: string;
  onEdit: (reservation: Reservation) => void;
  onDelete: (id: string) => void;
  onStatusChange: (reservation: Reservation, status: string) => void;
}

const ReservationsList: React.FC<ReservationsListProps> = ({
  reservations,
  selectedDate,
  statusFilter,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const getDateLabel = (date: Date) => {
    return format(date, 'MMM dd, yyyy');
  };

  const hasNoReservations = reservations.length === 0;
  const hasNoFilteredReservations = statusFilter !== 'all' && reservations.length === 0;

  if (hasNoReservations) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-32 text-center">
          <Calendar className="w-8 h-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">
            {hasNoFilteredReservations 
              ? 'No reservations match the current filter'
              : `No reservations found for ${getDateLabel(selectedDate)}`
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {reservations.map((reservation) => (
        <ReservationCard
          key={reservation.id}
          reservation={reservation}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default ReservationsList;
