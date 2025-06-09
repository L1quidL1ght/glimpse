
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { GuestFormData } from '@/hooks/useGuestForm';

interface NotesSectionProps {
  formData: GuestFormData;
  updateField: <K extends keyof GuestFormData>(field: K, value: GuestFormData[K]) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({ formData, updateField }) => {
  return (
    <>
      <Separator />
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Notes</label>
        <Textarea
          value={formData.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="Additional notes about the guest..."
          rows={3}
        />
      </div>
    </>
  );
};

export default NotesSection;
