
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600';
      case 'completed':
        return 'text-blue-600';
      case 'cancelled':
        return 'text-red-600';
      case 'no_show':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleCompletionChange = (checked: boolean) => {
    if (checked && reservation.status === 'confirmed') {
      onStatusChange(reservation, 'completed');
    } else if (!checked && reservation.status === 'completed') {
      onStatusChange(reservation, 'confirmed');
    }
  };

  const isCompleted = reservation.status === 'completed';
  const canToggleCompletion = reservation.status === 'confirmed' || reservation.status === 'completed';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            {/* Completion Checkbox */}
            {canToggleCompletion && (
              <div className="mt-1">
                <Checkbox
                  checked={isCompleted}
                  onCheckedChange={handleCompletionChange}
                  className="w-5 h-5"
                />
              </div>
            )}
            
            {/* Main Content */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {reservation.customer?.name}
                  </h3>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{reservation.reservation_time}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{reservation.party_size} guests</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2">
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

              {/* Contact Information */}
              <div className="flex flex-wrap gap-4 mb-3">
                {reservation.customer?.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{reservation.customer.phone}</span>
                  </div>
                )}
                {reservation.customer?.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{reservation.customer.email}</span>
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div className="space-y-2">
                {reservation.table_preference && (
                  <div className="text-sm">
                    <span className="font-medium text-foreground">Table Preference: </span>
                    <span className="text-muted-foreground">{reservation.table_preference}</span>
                  </div>
                )}
                
                <div className="text-sm">
                  <span className="font-medium text-foreground">Status: </span>
                  <span className={`${getStatusColor(reservation.status)} font-medium`}>
                    {reservation.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Special Requests */}
              {reservation.special_requests && (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <span className="text-sm font-medium text-foreground">Special Requests: </span>
                  <span className="text-sm text-muted-foreground">{reservation.special_requests}</span>
                </div>
              )}

              {/* Status Action Buttons */}
              {reservation.status === 'confirmed' && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onStatusChange(reservation, 'no_show')}
                    className="text-xs"
                  >
                    Mark No Show
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onStatusChange(reservation, 'cancelled')}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationCard;
