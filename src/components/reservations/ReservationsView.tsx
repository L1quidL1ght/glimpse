import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { addDays, subDays } from 'date-fns';
import { useReservations, type Reservation } from '@/hooks/useReservations';
import { useReservationFilters } from '@/hooks/useReservationFilters';
import ReservationDialog from './ReservationDialog';
import DateNavigator from './DateNavigator';
import ReservationStats from './ReservationStats';
import ReservationsList from './ReservationsList';
import { format, isToday, isTomorrow } from 'date-fns';
const ReservationsView: React.FC = () => {
  const {
    reservations,
    loading,
    updateReservation,
    deleteReservation
  } = useReservations();
  const [showDialog, setShowDialog] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Remove status filter and always show all reservations
  const {
    sortedReservations,
    reservationCounts
  } = useReservationFilters(reservations, selectedDate, 'all');
  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMMM dd, yyyy');
  };
  const navigateDate = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => direction === 'prev' ? subDays(prev, 1) : addDays(prev, 1));
  };
  const handleEdit = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setShowDialog(true);
  };
  const handleStatusChange = async (reservation: Reservation, newStatus: string) => {
    await updateReservation(reservation.id, {
      status: newStatus as any
    });
  };
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this reservation?')) {
      await deleteReservation(id);
    }
  };
  const handleDialogClose = () => {
    setShowDialog(false);
    setEditingReservation(null);
  };
  if (loading) {
    return <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading reservations...</div>
      </div>;
  }
  return <div className="space-y-8 pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
        <div>
          <h2 className="text-xl font-semibold">Reservations</h2>
          
        </div>
        <Button onClick={() => setShowDialog(true)} className="flex items-center gap-2 h-12 px-6 text-base font-semibold">
          <Plus className="w-5 h-5" />
          New Reservation
        </Button>
      </div>

      {/* Date Navigation and Stats - 50/50 Layout */}
      <div className="flex gap-6">
        <div className="flex-1">
          <DateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} onNavigateDate={navigateDate} showDatePicker={showDatePicker} onShowDatePickerChange={setShowDatePicker} />
        </div>
        <div className="flex-1">
          <ReservationStats counts={{
          total: reservationCounts.total,
          completed: reservationCounts.completed
        }} />
        </div>
      </div>

      {/* Reservations List */}
      <ReservationsList reservations={sortedReservations} selectedDate={selectedDate} statusFilter="all" onEdit={handleEdit} onDelete={handleDelete} onStatusChange={handleStatusChange} />

      <ReservationDialog open={showDialog} onOpenChange={handleDialogClose} reservation={editingReservation} />
    </div>;
};
export default ReservationsView;