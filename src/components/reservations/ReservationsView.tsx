
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Phone, Mail, Plus, Edit, Trash2 } from 'lucide-react';
import { useReservations, type Reservation } from '@/hooks/useReservations';
import ReservationDialog from './ReservationDialog';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

const ReservationsView: React.FC = () => {
  const { reservations, loading, updateReservation, deleteReservation } = useReservations();
  const [showDialog, setShowDialog] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);

  const getStatusColor = (status: string, date: string) => {
    if (isPast(new Date(date)) && status === 'confirmed') {
      return 'bg-yellow-500';
    }
    
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'no_show':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getDateLabel = (date: string) => {
    const reservationDate = new Date(date);
    if (isToday(reservationDate)) return 'Today';
    if (isTomorrow(reservationDate)) return 'Tomorrow';
    return format(reservationDate, 'MMM dd, yyyy');
  };

  const handleEdit = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setShowDialog(true);
  };

  const handleStatusChange = async (reservation: Reservation, newStatus: string) => {
    await updateReservation(reservation.id, { status: newStatus as any });
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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading reservations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reservations</h2>
        <Button onClick={() => setShowDialog(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Reservation
        </Button>
      </div>

      {reservations.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">No reservations found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reservations.map((reservation) => (
            <Card key={reservation.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{reservation.customer?.name}</CardTitle>
                    <Badge className={`${getStatusColor(reservation.status, reservation.reservation_date)} text-white`}>
                      {reservation.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(reservation)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(reservation.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{getDateLabel(reservation.reservation_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{reservation.reservation_time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{reservation.party_size} guests</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {reservation.customer?.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{reservation.customer.phone}</span>
                      </div>
                    )}
                    {reservation.customer?.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{reservation.customer.email}</span>
                      </div>
                    )}
                    {reservation.table_preference && (
                      <div className="text-sm">
                        <span className="font-medium">Table: </span>
                        <span>{reservation.table_preference}</span>
                      </div>
                    )}
                  </div>
                </div>

                {reservation.special_requests && (
                  <div className="mt-3 p-3 bg-muted rounded-md">
                    <span className="text-sm font-medium">Special Requests: </span>
                    <span className="text-sm">{reservation.special_requests}</span>
                  </div>
                )}

                {reservation.status === 'confirmed' && (
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(reservation, 'completed')}
                    >
                      Mark Completed
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(reservation, 'no_show')}
                    >
                      Mark No Show
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(reservation, 'cancelled')}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ReservationDialog
        open={showDialog}
        onOpenChange={handleDialogClose}
        reservation={editingReservation}
      />
    </div>
  );
};

export default ReservationsView;
