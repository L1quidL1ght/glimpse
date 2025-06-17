
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
    return format(date, 'MMMM dd, yyyy');
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

  // Separate reservations into upcoming and completed
  const upcomingReservations = reservations.filter(r => r.status !== 'completed');
  const completedReservations = reservations.filter(r => r.status === 'completed');

  return (
    <div className="space-y-8">
      {/* Upcoming Reservations Section */}
      {upcomingReservations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">
            Upcoming ({upcomingReservations.length})
          </h3>
          <div className="grid gap-4">
            {upcomingReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Reservations Section */}
      {completedReservations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-muted-foreground">
            Completed ({completedReservations.length})
          </h3>
          <div className="grid gap-4 opacity-60">
            {completedReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationsList;
