
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Phone, Mail, Edit, Trash2 } from 'lucide-react';
import { type Reservation } from '@/hooks/useReservations';
import { isPast } from 'date-fns';

interface ReservationCardProps {
  reservation: Reservation;
  onEdit: (reservation: Reservation) => void;
  onDelete: (id: string) => void;
  onStatusChange: (reservation: Reservation, status: string) => void;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onEdit,
  onDelete,
  onStatusChange
}) => {
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

  return (
    <Card className="hover:shadow-md transition-shadow">
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
              onClick={() => onEdit(reservation)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(reservation.id)}
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
              onClick={() => onStatusChange(reservation, 'completed')}
            >
              Mark Completed
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStatusChange(reservation, 'no_show')}
            >
              Mark No Show
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStatusChange(reservation, 'cancelled')}
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReservationCard;
