
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Phone, Mail, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Calendar as DatePicker } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useReservations, type Reservation } from '@/hooks/useReservations';
import ReservationDialog from './ReservationDialog';
import { format, isToday, isTomorrow, isPast, isAfter, isBefore, startOfDay, addDays, subDays } from 'date-fns';
import { cn } from '@/lib/utils';

const ReservationsView: React.FC = () => {
  const { reservations, loading, updateReservation, deleteReservation } = useReservations();
  const [showDialog, setShowDialog] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM dd, yyyy');
  };

  const filteredReservations = useMemo(() => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return reservations.filter(reservation => {
      const matchesDate = reservation.reservation_date === dateStr;
      const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
      return matchesDate && matchesStatus;
    });
  }, [reservations, selectedDate, statusFilter]);

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

  const navigateDate = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => direction === 'prev' ? subDays(prev, 1) : addDays(prev, 1));
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Reservations</h2>
          <p className="text-muted-foreground">
            {reservationCounts.total} reservations on {getDateLabel(selectedDate)}
          </p>
        </div>
        <Button onClick={() => setShowDialog(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Reservation
        </Button>
      </div>

      {/* Date Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate('prev')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="min-w-[200px]">
                    <Calendar className="w-4 h-4 mr-2" />
                    {getDateLabel(selectedDate)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <DatePicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date);
                        setShowDatePicker(false);
                      }
                    }}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate('next')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={isToday(selectedDate) ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDate(new Date())}
              >
                Today
              </Button>
              <Button
                variant={isTomorrow(selectedDate) ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDate(addDays(new Date(), 1))}
              >
                Tomorrow
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats and Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{reservationCounts.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{reservationCounts.confirmed}</div>
            <div className="text-sm text-muted-foreground">Confirmed</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{reservationCounts.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{reservationCounts.cancelled}</div>
            <div className="text-sm text-muted-foreground">Cancelled</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{reservationCounts.no_show}</div>
            <div className="text-sm text-muted-foreground">No Show</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
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

      {/* Reservations List */}
      {sortedReservations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-32 text-center">
            <Calendar className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              {filteredReservations.length === 0 
                ? `No reservations found for ${getDateLabel(selectedDate)}`
                : 'No reservations match the current filter'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sortedReservations.map((reservation) => (
            <Card key={reservation.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-semibold text-lg">{reservation.customer?.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{reservation.reservation_time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{reservation.party_size} guests</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(reservation.status, reservation.reservation_date)} text-white`}>
                      {reservation.status.replace('_', ' ')}
                    </Badge>
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

                <div className="grid md:grid-cols-2 gap-4">
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
                  </div>

                  <div className="space-y-2">
                    {reservation.table_preference && (
                      <div className="text-sm">
                        <span className="font-medium">Table: </span>
                        <span>{reservation.table_preference}</span>
                      </div>
                    )}
                  </div>
                </div>

                {reservation.special_requests && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
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
