import React, { useState } from 'react';
import { Check, ChevronsUpDown, User, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCustomerAutocomplete } from '@/hooks/useCustomerAutocomplete';

interface ConnectionsComboboxProps {
  value: string;
  onSelect: (customerName: string) => void;
  placeholder?: string;
  excludeCustomerId?: string;
}

const ConnectionsCombobox: React.FC<ConnectionsComboboxProps> = ({
  value,
  onSelect,
  placeholder = "Search guests...",
  excludeCustomerId
}) => {
  const [open, setOpen] = useState(false);
  const { customers, isLoading } = useCustomerAutocomplete();

  const filteredCustomers = customers.filter(customer => 
    excludeCustomerId ? customer.id !== excludeCustomerId : true
  );

  const selectedCustomer = filteredCustomers.find(customer => 
    customer.name.toLowerCase() === value.toLowerCase()
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCustomer ? selectedCustomer.name : value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 z-[60]" align="start">
        <Command>
          <CommandInput placeholder="Search guests..." />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Searching..." : "No guests found."}
            </CommandEmpty>
            <CommandGroup>
              {filteredCustomers.map((customer) => (
                <CommandItem
                  key={customer.id}
                  value={customer.name}
                  onSelect={(currentValue) => {
                    console.log('ConnectionsCombobox: Customer selected:', customer.name);
                    onSelect(customer.name);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Check
                      className={cn(
                        "h-4 w-4",
                        value.toLowerCase() === customer.name.toLowerCase()
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      {customer.phone && (
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {customer.phone}
                        </div>
                      )}
                    </div>
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

export default ConnectionsCombobox;