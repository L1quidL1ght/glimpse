
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { TagIcon } from '@/components/ui/tag-icon';

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  tags?: string[];
  totalVisits?: number;
  lastVisit?: string;
}

interface GuestListItemProps {
  customer: Customer;
  onClick: () => void;
}

const GuestListItem: React.FC<GuestListItemProps> = ({ customer, onClick }) => {
  const getTagVariant = (tag: string) => {
    switch (tag) {
      case 'VIP':
        return 'default';
      case '333 Club':
        return 'secondary';
      case 'Regular':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card 
      className="p-4 cursor-pointer hover:bg-accent/50 transition-all duration-200 bg-card border border-border group"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        {/* Profile Picture */}
        <Avatar className="w-12 h-12">
          {customer.avatar_url ? (
            <AvatarImage 
              src={customer.avatar_url} 
              alt={customer.name}
              className="object-cover"
            />
          ) : null}
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary font-medium">
            {getInitials(customer.name)}
          </AvatarFallback>
        </Avatar>

        {/* Customer Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
              {customer.name}
            </h3>
            {/* Tag Icons beside name */}
            <div className="flex items-center gap-1">
              {customer.tags && customer.tags.slice(0, 3).map((tag, index) => (
                <TagIcon key={index} tagName={tag} className="w-4 h-4" />
              ))}
              {customer.tags && customer.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">+{customer.tags.length - 3}</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {customer.email && (
              <span className="truncate">{customer.email}</span>
            )}
            {customer.phone && (
              <span>{customer.phone}</span>
            )}
          </div>
          
          {/* Tag badges */}
          <div className="flex items-center gap-2 mt-1">
            {customer.tags && customer.tags.map((tag, index) => (
              <Badge key={index} variant={getTagVariant(tag)} className="text-xs flex items-center gap-1">
                <TagIcon tagName={tag} className="w-3 h-3" />
                {tag}
              </Badge>
            ))}
            {customer.totalVisits !== undefined && (
              <Badge variant="secondary" className="text-xs">
                {customer.totalVisits} visits
              </Badge>
            )}
          </div>
        </div>

        {/* Arrow indicator */}
        <div className="text-muted-foreground group-hover:text-primary transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Card>
  );
};

export default GuestListItem;
