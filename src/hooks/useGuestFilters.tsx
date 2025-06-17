
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

export const useGuestFilters = (customers: Customer[]) => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [filteredByDatabase, setFilteredByDatabase] = useState<Customer[]>([]);

  const handleFilterChange = (filterType: string, value: string | null) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      if (value === null || value === '') {
        delete newFilters[filterType];
      } else {
        newFilters[filterType] = value;
      }
      return newFilters;
    });
  };

  const clearFilters = () => {
    setActiveFilters({});
  };

  // Fetch filtered customers from database when birthday or anniversary filters are active
  useEffect(() => {
    const fetchFilteredCustomers = async () => {
      let dbResults: Customer[] = [];

      if (activeFilters.birthdayMonth) {
        const { data } = await supabase.rpc('get_guests_by_birthday_month', {
          month_num: parseInt(activeFilters.birthdayMonth)
        });
        if (data) dbResults = [...dbResults, ...data];
      }

      if (activeFilters.anniversaryMonth) {
        const { data } = await supabase.rpc('get_guests_by_anniversary_month', {
          month_num: parseInt(activeFilters.anniversaryMonth)
        });
        if (data) dbResults = [...dbResults, ...data];
      }

      if (activeFilters.tag) {
        const { data } = await supabase.rpc('get_guests_by_tag', {
          tag_name: activeFilters.tag
        });
        if (data) dbResults = [...dbResults, ...data];
      }

      // Remove duplicates
      const uniqueResults = dbResults.filter((customer, index, self) =>
        index === self.findIndex(c => c.id === customer.id)
      );

      setFilteredByDatabase(uniqueResults);
    };

    if (activeFilters.birthdayMonth || activeFilters.anniversaryMonth || activeFilters.tag) {
      fetchFilteredCustomers();
    } else {
      setFilteredByDatabase([]);
    }
  }, [activeFilters]);

  const filteredCustomers = useMemo(() => {
    if (Object.keys(activeFilters).length === 0) {
      return customers;
    }

    // If we have database filters active, use those results
    if (activeFilters.birthdayMonth || activeFilters.anniversaryMonth || activeFilters.tag) {
      return filteredByDatabase;
    }

    return customers;
  }, [customers, activeFilters, filteredByDatabase]);

  return {
    filteredCustomers,
    activeFilters,
    handleFilterChange,
    clearFilters
  };
};
