
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';

interface ProfileHeaderProps {
  onBack: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onBack }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} size="icon">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Logo />
      </div>
    </div>
  );
};

export default ProfileHeader;
