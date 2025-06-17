
import React, { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCustomerAutocomplete } from '@/hooks/useCustomerAutocomplete';

interface CustomerAutocompleteProps {
  value: string;
  onSelect: (customerId: string) => void;
  placeholder?: string;
  excludeCustomerId?: string;
}

const CustomerAutocomplete: React.FC<CustomerAutocompleteProps> = ({
  value,
  onSelect,
  placeholder = "Select customer...",
  excludeCustomerId
}) => {
  const [open, setOpen] = useState(false);
  const { customers } = useCustomerAutocomplete();

  const filteredCustomers = customers.filter(customer => 
    excludeCustomerId ? customer.id !== excludeCustomerId : true
  );

  const selectedCustomer = customers.find(customer => customer.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCustomer ? selectedCustomer.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search customers..." />
          <CommandList>
            <CommandEmpty>No customer found.</CommandEmpty>
            <CommandGroup>
              {filteredCustomers.map((customer) => (
                <CommandItem
                  key={customer.id}
                  value={customer.name}
                  onSelect={() => {
                    onSelect(customer.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === customer.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{customer.name}</span>
                    {customer.email && (
                      <span className="text-sm text-muted-foreground">{customer.email}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CustomerAutocomplete;
