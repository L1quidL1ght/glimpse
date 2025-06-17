
import { useMemo } from 'react';
import { format } from 'date-fns';
import { type Reservation } from '@/hooks/useReservations';

export const useReservationFilters = (
  reservations: Reservation[],
  selectedDate: Date,
  statusFilter: string
) => {
  const filteredReservations = useMemo(() => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return reservations.filter(reservation => {
      return reservation.reservation_date === dateStr;
    });
  }, [reservations, selectedDate]);

  const sortedReservations = useMemo(() => {
    return [...filteredReservations].sort((a, b) => {
      return a.reservation_time.localeCompare(b.reservation_time);
    });
  }, [filteredReservations]);

  const reservationCounts = useMemo(() => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const dayReservations = reservations.filter(r => r.reservation_date === dateStr);
    
    return {
      total: dayReservations.length,
      confirmed: dayReservations.filter(r => r.status === 'confirmed').length,
      completed: dayReservations.filter(r => r.status === 'completed').length,
      cancelled: dayReservations.filter(r => r.status === 'cancelled').length,
      no_show: dayReservations.filter(r => r.status === 'no_show').length,
    };
  }, [reservations, selectedDate]);

  return {
    filteredReservations,
    sortedReservations,
    reservationCounts,
  };
};
