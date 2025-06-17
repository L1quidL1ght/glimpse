
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Edit, Trash2, Check } from 'lucide-react';
import { type Reservation } from '@/hooks/useReservations';

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
  const handleCompletionToggle = () => {
    if (reservation.status === 'confirmed') {
      onStatusChange(reservation, 'completed');
    } else if (reservation.status === 'completed') {
      onStatusChange(reservation, 'confirmed');
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours, 10);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 < 12 ? 'AM' : 'PM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const isCompleted = reservation.status === 'completed';
  const canToggleCompletion = reservation.status === 'confirmed' || reservation.status === 'completed';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Left side - Time and Guest Info */}
          <div className="flex items-center gap-4 flex-1">
            {/* Time Box */}
            <div className="bg-gray-50 text-gray-700 px-3 py-2 rounded-md text-sm font-semibold min-w-[80px] text-center">
              {formatTime(reservation.reservation_time)}
            </div>
            
            {/* Guest Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <h3 className="text-lg font-bold text-foreground">
                    {reservation.customer?.name}
                  </h3>
                  
                  {/* Guest Count and Table Preference */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1 font-semibold">
                      <Users className="w-4 h-4" />
                      <span>{reservation.party_size} guests</span>
                    </div>
                    {reservation.table_preference && (
                      <div className="font-semibold">
                        Table: {reservation.table_preference}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {reservation.special_requests && (
                <div className="mt-2 text-sm text-muted-foreground">
                  <span className="font-medium">Special Requests: </span>
                  <span>{reservation.special_requests}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Action Buttons */}
          <div className="flex items-center gap-2 ml-4">
            {canToggleCompletion && (
              <Button
                variant={isCompleted ? "default" : "outline"}
                size="sm"
                onClick={handleCompletionToggle}
                className={isCompleted ? "bg-green-600 text-white hover:bg-green-700" : "text-green-600 border-green-600 hover:bg-green-50"}
              >
                <Check className="w-4 h-4" />
              </Button>
            )}
            
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

        {/* Status Action Buttons for other statuses */}
        {reservation.status === 'confirmed' && (
          <div className="mt-3 flex flex-wrap gap-2">
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
      </CardContent>
    </Card>
  );
};

export default ReservationCard;
