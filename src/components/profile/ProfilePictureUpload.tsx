
import React, { useState } from 'react';
import { Camera, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProfilePictureUploadProps {
  currentAvatarUrl?: string | null;
  customerName: string;
  customerId: string;
  onAvatarUpdated: (newUrl: string | null) => void;
  isEditing?: boolean;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentAvatarUrl,
  customerName,
  customerId,
  onAvatarUpdated,
  isEditing = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${customerId}.${fileExt}`;
      const filePath = fileName;

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      const avatarUrl = data.publicUrl;

      // Update the customer record with the new avatar URL
      const { error: updateError } = await supabase
        .from('customers')
        .update({ avatar_url: avatarUrl })
        .eq('id', customerId);

      if (updateError) throw updateError;

      onAvatarUpdated(avatarUrl);
      toast({
        title: "Success",
        description: "Profile picture updated successfully"
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteAvatar = async () => {
    try {
      setDeleting(true);

      // Extract filename from current URL
      if (currentAvatarUrl) {
        const urlParts = currentAvatarUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];

        // Delete from storage
        const { error: deleteError } = await supabase.storage
          .from('profile-pictures')
          .remove([fileName]);

        if (deleteError) throw deleteError;
      }

      // Update the customer record to remove avatar URL
      const { error: updateError } = await supabase
        .from('customers')
        .update({ avatar_url: null })
        .eq('id', customerId);

      if (updateError) throw updateError;

      onAvatarUpdated(null);
      toast({
        title: "Success",
        description: "Profile picture removed successfully"
      });
    } catch (error) {
      console.error('Error deleting avatar:', error);
      toast({
        title: "Error",
        description: "Failed to remove profile picture",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive"
        });
        return;
      }
      uploadAvatar(file);
    }
  };

  return (
    <div className="relative group">
      <Avatar className="w-24 h-24">
        {currentAvatarUrl ? (
          <AvatarImage 
            src={currentAvatarUrl} 
            alt={customerName}
            className="object-cover"
          />
        ) : null}
        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary font-medium text-lg">
          {getInitials(customerName)}
        </AvatarFallback>
      </Avatar>
      
      {isEditing && (
        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex gap-1">
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading || deleting}
              />
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 text-black hover:bg-white p-2"
                disabled={uploading || deleting}
                asChild
              >
                <span className="flex items-center">
                  {uploading ? (
                    <Upload className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </span>
              </Button>
            </label>
            
            {currentAvatarUrl && (
              <Button
                size="sm"
                variant="destructive"
                className="p-2"
                disabled={uploading || deleting}
                onClick={deleteAvatar}
              >
                {deleting ? (
                  <Upload className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUpload;
