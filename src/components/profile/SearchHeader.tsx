
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ArrowLeft, Search, Crown, Star } from 'lucide-react';
import Logo from '@/components/Logo';

interface SearchHeaderProps {
  onBack: () => void;
  allCustomers: any[];
  onCustomerSelect: (customer: any) => void;
  currentCustomer: any;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ onBack, allCustomers, onCustomerSelect, currentCustomer }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const filteredCustomers = allCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchValue.toLowerCase()) &&
    customer.id !== currentCustomer.id
  );

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Logo />
        </div>
      </div>
      
      <div className="relative">
        <Command className="rounded-lg border">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              placeholder="Search other guests..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          {searchOpen && searchValue && filteredCustomers.length > 0 && (
            <CommandList className="max-h-48">
              <CommandGroup>
                {filteredCustomers.slice(0, 5).map((customer) => {
                  const has333Club = customer.tags?.includes('333 Club');
                  const hasVIP = customer.tags?.includes('VIP');
                  
                  return (
                    <CommandItem
                      key={customer.id}
                      onSelect={() => {
                        onCustomerSelect(customer);
                        setSearchValue('');
                        setSearchOpen(false);
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <span>{customer.name}</span>
                      {has333Club && <Crown className="w-4 h-4" style={{ color: 'gold' }} />}
                      {hasVIP && <Star className="w-4 h-4" style={{ color: 'gold' }} />}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          )}
        </Command>
      </div>
    </div>
  );
};

export default SearchHeader;
