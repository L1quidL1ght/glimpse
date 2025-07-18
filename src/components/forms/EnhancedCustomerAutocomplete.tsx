import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, User, Phone, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EnhancedCustomerAutocompleteProps {
  value: string;
  onSelect: (name: string) => void;
  placeholder?: string;
  excludeCustomerId?: string;
}

interface Customer {
  id: string;
  name: string;
  phone?: string;
}

const EnhancedCustomerAutocomplete: React.FC<EnhancedCustomerAutocompleteProps> = ({
  value,
  onSelect,
  placeholder = "Search guests...",
  excludeCustomerId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTempForm, setShowTempForm] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempPhone, setTempPhone] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const { toast } = useToast();

  const searchCustomers = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setCustomers([]);
      return;
    }

    setLoading(true);
    try {
      let query = supabase
        .from('customers')
        .select('id, name, phone')
        .ilike('name', `%${searchTerm}%`)
        .eq('is_temporary', false)
        .order('name');

      if (excludeCustomerId) {
        query = query.neq('id', excludeCustomerId);
      }

      const { data, error } = await query.limit(10);

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error searching customers:', error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchCustomers(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value, excludeCustomerId]);

  const updateDropdownPosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onSelect(newValue);
    setIsOpen(true);
    updateDropdownPosition();
  };

  const handleCustomerSelect = (customer: Customer) => {
    console.log('Customer selected:', customer.name);
    console.log('About to call onSelect with:', customer.name);
    onSelect(customer.name);
    console.log('onSelect called, closing dropdown');
    setIsOpen(false);
  };

  const handleShowTempForm = () => {
    setShowTempForm(true);
    setTempName(value);
    setIsOpen(false);
    updateDropdownPosition();
  };

  const createTemporaryGuest = async () => {
    if (!tempName.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert({
          name: tempName.trim(),
          phone: tempPhone.trim() || null,
          is_temporary: true
        })
        .select()
        .single();

      if (error) throw error;

      onSelect(tempName.trim());
      setShowTempForm(false);
      setTempName('');
      setTempPhone('');
      
      toast({
        title: "Success",
        description: "Temporary guest created successfully"
      });
    } catch (error) {
      console.error('Error creating temporary guest:', error);
      toast({
        title: "Error",
        description: "Failed to create temporary guest",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const cancelTempForm = () => {
    setShowTempForm(false);
    setTempName('');
    setTempPhone('');
  };

  const hasExactMatch = customers.some(customer => 
    customer.name.toLowerCase() === value.toLowerCase()
  );

  const renderDropdown = () => {
    if (!isOpen && !showTempForm) return null;

    const content = isOpen ? (
      <Card 
        className="absolute z-[60] mt-1 max-h-60 overflow-y-auto bg-background border shadow-lg"
        style={{
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          width: `${dropdownPosition.width}px`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent className="p-0">
          {loading ? (
            <div className="p-3 text-sm text-muted-foreground">Searching...</div>
          ) : (
            <>
              {customers.map((customer) => (
                <button
                  key={customer.id}
                  className="w-full text-left p-3 hover:bg-muted border-b border-border last:border-b-0 flex items-center justify-between"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Button clicked for customer:', customer.name);
                    handleCustomerSelect(customer);
                  }}
                >
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    {customer.phone && (
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {customer.phone}
                      </div>
                    )}
                  </div>
                </button>
              ))}
              
              {value.trim() && !hasExactMatch && !loading && (
                <button
                  className="w-full text-left p-3 hover:bg-muted border-t border-border flex items-center gap-2 text-primary"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleShowTempForm();
                  }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Temporary Guest</span>
                </button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    ) : (
      <Card 
        className="absolute z-[60] mt-1 bg-background border shadow-lg"
        style={{
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          width: `${dropdownPosition.width}px`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Add Temporary Guest</span>
          </div>
          
          <div className="space-y-2">
            <Input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Name (required)"
              autoFocus
            />
            <Input
              value={tempPhone}
              onChange={(e) => setTempPhone(e.target.value)}
              placeholder="Phone (optional)"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={createTemporaryGuest}
              disabled={!tempName.trim() || isCreating}
              className="flex items-center gap-1"
            >
              <Check className="w-4 h-4" />
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={cancelTempForm}
              disabled={isCreating}
              className="flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );

    return createPortal(
      <div 
        className="fixed inset-0 z-[50]" 
        onMouseDown={(e) => {
          console.log('Overlay clicked');
          e.preventDefault();
          setIsOpen(false);
          setShowTempForm(false);
        }}
      >
        {content}
      </div>,
      document.body
    );
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          setIsOpen(true);
          updateDropdownPosition();
        }}
        onBlur={() => {
          console.log('Input blur event triggered');
          setTimeout(() => {
            console.log('Closing dropdown after timeout');
            setIsOpen(false);
          }, 300);
        }}
        placeholder={placeholder}
      />
      {renderDropdown()}
    </div>
  );
};

export default EnhancedCustomerAutocomplete;