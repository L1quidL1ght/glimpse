
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { TagIcon } from '@/components/ui/tag-icon';
import ProfilePictureUpload from './ProfilePictureUpload';

interface ProfileCardProps {
  customer: any;
  isEditing?: boolean;
  onCustomerUpdated?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  customer, 
  isEditing = false, 
  onCustomerUpdated 
}) => {
  const [avatarUrl, setAvatarUrl] = useState(customer.avatar_url);

  const handleAvatarUpdated = (newUrl: string | null) => {
    setAvatarUrl(newUrl);
    if (onCustomerUpdated) {
      onCustomerUpdated();
    }
  };

  return (
    <Card className="p-6 bg-card border border-border">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Profile Picture */}
        <ProfilePictureUpload
          currentAvatarUrl={avatarUrl}
          customerName={customer.name}
          customerId={customer.id}
          onAvatarUpdated={handleAvatarUpdated}
          isEditing={isEditing}
        />

        {/* Name with Icons */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 justify-center">
            <h2 className="text-xl font-bold text-foreground">{customer.name}</h2>
            {/* Tag Icons beside name - show only first 3 */}
            <div className="flex items-center gap-1">
              {customer.tags && customer.tags.slice(0, 3).map((tag: string, index: number) => (
                <TagIcon key={index} tagName={tag} className="w-5 h-5" />
              ))}
            </div>
          </div>
          <div className="space-y-1 text-sm text-muted-foreground">
            {customer.member_id && (
              <div className="font-medium">Member #{customer.member_id}</div>
            )}
            <div>{customer.email}</div>
            <div>{customer.phone}</div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-2 flex-wrap justify-center">
          {customer.tags && customer.tags.map((tag: string, index: number) => (
            <Badge key={index} variant="secondary" className="bg-accent text-accent-foreground flex items-center gap-1">
              <TagIcon tagName={tag} className="w-3 h-3" />
              {tag}
            </Badge>
          ))}
        </div>

        {/* Last Visit */}
        {customer.lastVisit && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Last visit: {new Date(customer.lastVisit).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProfileCard;
