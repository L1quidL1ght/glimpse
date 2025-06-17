
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Edit, Trash2, Check, MapPin, StickyNote } from 'lucide-react';
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
            <div className="px-3 py-2 rounded-md text-sm font-semibold min-w-[80px] text-center text-white" style={{
              backgroundColor: '#333131'
            }}>
              {formatTime(reservation.reservation_time)}
            </div>
            
            {/* Guest Info - Using CSS Grid for consistent alignment */}
            <div className="flex-1">
              <div className="grid grid-cols-4 gap-2 items-center">
                {/* Guest Name - Fixed width */}
                <div className="min-w-[200px]">
                  <h3 className="font-bold text-foreground text-base">
                    {reservation.customer?.name}
                  </h3>
                </div>
                
                {/* Guest Count - Fixed width */}
                <div className="flex items-center gap-0.5 text-sm text-muted-foreground font-semibold min-w-[100px]">
                  <Users className="w-4 h-4" />
                  <span>{reservation.party_size} Guests</span>
                </div>
                
                {/* Section and Table - Fixed width */}
                <div className="min-w-[150px]">
                  {reservation.section && (
                    <div className="flex items-center gap-0.5 text-sm text-muted-foreground font-semibold">
                      <MapPin className="w-4 h-4" />
                      <span>{reservation.section}{reservation.table_id ? ` - Table ${reservation.table_id}` : ''}</span>
                    </div>
                  )}
                </div>
                
                {/* Special Requests - Flexible width */}
                <div className="flex-1">
                  {reservation.special_requests && (
                    <div className="flex items-center gap-0.5 text-sm text-muted-foreground">
                      <StickyNote className="w-4 h-4" />
                      <span className="font-medium">Note: </span>
                      <span className="truncate">{reservation.special_requests}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Action Buttons */}
          <div className="flex items-center gap-2 ml-4">
            {canToggleCompletion && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCompletionToggle}
                className={isCompleted ? "bg-green-600 text-white hover:bg-green-700 border-input" : "text-green-600 hover:bg-green-50 border-input"}
              >
                <Check className="w-4 h-4" />
              </Button>
            )}
            
            <Button variant="outline" size="sm" onClick={() => onEdit(reservation)}>
              <Edit className="w-4 h-4" />
            </Button>
            
            <Button variant="outline" size="sm" onClick={() => onDelete(reservation.id)} className="text-red-600 hover:text-red-700">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationCard;
