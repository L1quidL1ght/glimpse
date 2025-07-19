
import React from 'react';
import GuestListItem from '@/components/GuestListItem';

interface GuestListProps {
  customers: any[];
  onCustomerSelect: (customer: any) => void;
}

const GuestList: React.FC<GuestListProps> = ({
  customers,
  onCustomerSelect
}) => {

  if (customers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">No guests found</div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {customers.map(customer => (
        <GuestListItem 
          key={customer.id}
          customer={customer} 
          onClick={() => onCustomerSelect(customer)} 
        />
      ))}
    </div>
  );
};

export default GuestList;
