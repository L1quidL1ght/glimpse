
import { useState, useEffect } from 'react';
import { type Reservation } from '@/hooks/useReservations';

interface ReservationFormData {
  customer_id: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  section: string;
  table_id: string;
  special_requests: string;
}

export const useReservationForm = (reservation?: Reservation | null) => {
  const [formData, setFormData] = useState<ReservationFormData>({
    customer_id: '',
    reservation_date: '',
    reservation_time: '',
    party_size: 2,
    section: '',
    table_id: '',
    special_requests: ''
  });

  useEffect(() => {
    if (reservation) {
      setFormData({
        customer_id: reservation.customer_id,
        reservation_date: reservation.reservation_date,
        reservation_time: reservation.reservation_time,
        party_size: reservation.party_size,
        section: reservation.section || '',
        table_id: reservation.table_id || '',
        special_requests: reservation.special_requests || ''
      });
    } else {
      setFormData({
        customer_id: '',
        reservation_date: '',
        reservation_time: '',
        party_size: 2,
        section: '',
        table_id: '',
        special_requests: ''
      });
    }
  }, [reservation]);

  const updateField = (field: keyof ReservationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return formData.customer_id && formData.reservation_date && formData.reservation_time && formData.section;
  };

  return {
    formData,
    updateField,
    isFormValid,
  };
};
