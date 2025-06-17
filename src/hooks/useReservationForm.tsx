
import { useState, useEffect } from 'react';
import { type Reservation } from '@/hooks/useReservations';

interface ReservationFormData {
  customer_id: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  table_preference: string;
  special_requests: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
}

export const useReservationForm = (reservation?: Reservation | null) => {
  const [formData, setFormData] = useState<ReservationFormData>({
    customer_id: '',
    reservation_date: '',
    reservation_time: '',
    party_size: 2,
    table_preference: '',
    special_requests: '',
    status: 'confirmed'
  });

  useEffect(() => {
    if (reservation) {
      setFormData({
        customer_id: reservation.customer_id,
        reservation_date: reservation.reservation_date,
        reservation_time: reservation.reservation_time,
        party_size: reservation.party_size,
        table_preference: reservation.table_preference || '',
        special_requests: reservation.special_requests || '',
        status: reservation.status
      });
    } else {
      setFormData({
        customer_id: '',
        reservation_date: '',
        reservation_time: '',
        party_size: 2,
        table_preference: '',
        special_requests: '',
        status: 'confirmed'
      });
    }
  }, [reservation]);

  const updateField = (field: keyof ReservationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return formData.customer_id && formData.reservation_date && formData.reservation_time;
  };

  return {
    formData,
    updateField,
    isFormValid,
  };
};
