
import React from 'react';
import { Crown, Star, Users, Heart, Zap, Shield, Award, Gem } from 'lucide-react';

interface TagIconProps {
  tagName: string;
  className?: string;
}

const getTagIcon = (tagName: string) => {
  const tag = tagName.toLowerCase();
  
  switch (tag) {
    case '333 club':
      return Crown;
    case 'vip':
      return Star;
    case 'regular':
      return Users;
    case 'anniversary':
      return Heart;
    case 'birthday':
      return Award;
    case 'special occasion':
      return Gem;
    case 'frequent':
      return Zap;
    case 'premium':
      return Shield;
    default:
      return Star; // Default icon for unknown tags
  }
};

const getTagColor = (tagName: string) => {
  const tag = tagName.toLowerCase();
  
  switch (tag) {
    case '333 club':
      return 'text-yellow-500';
    case 'vip':
      return 'text-purple-500';
    case 'regular':
      return 'text-blue-500';
    case 'anniversary':
      return 'text-red-500';
    case 'birthday':
      return 'text-green-500';
    case 'special occasion':
      return 'text-pink-500';
    case 'frequent':
      return 'text-orange-500';
    case 'premium':
      return 'text-indigo-500';
    default:
      return 'text-gray-500';
  }
};

export const TagIcon: React.FC<TagIconProps> = ({ tagName, className = "w-4 h-4" }) => {
  const IconComponent = getTagIcon(tagName);
  const colorClass = getTagColor(tagName);
  
  return <IconComponent className={`${className} ${colorClass}`} />;
};
