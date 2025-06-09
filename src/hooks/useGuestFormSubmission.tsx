
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GuestFormData } from './useGuestForm';

export const useGuestFormSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async (formData: GuestFormData, customerId?: string) => {
    setIsSubmitting(true);

    try {
      let customer;

      if (customerId) {
        // Update existing customer
        const { error: customerError } = await supabase
          .from('customers')
          .update({
            name: formData.name.trim(),
            email: formData.email.trim() || null,
            phone: formData.phone.trim() || null,
          })
          .eq('id', customerId);

        if (customerError) throw customerError;
        customer = { id: customerId };
      } else {
        // Insert new customer
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .insert({
            name: formData.name.trim(),
            email: formData.email.trim() || null,
            phone: formData.phone.trim() || null,
          })
          .select()
          .single();

        if (customerError) throw customerError;
        customer = customerData;
      }

      // If updating, delete existing related data first
      if (customerId) {
        await Promise.all([
          supabase.from('customer_tags').delete().eq('customer_id', customerId),
          supabase.from('table_preferences').delete().eq('customer_id', customerId),
          supabase.from('food_preferences').delete().eq('customer_id', customerId),
          supabase.from('wine_preferences').delete().eq('customer_id', customerId),
          supabase.from('cocktail_preferences').delete().eq('customer_id', customerId),
          supabase.from('spirits_preferences').delete().eq('customer_id', customerId),
          supabase.from('allergies').delete().eq('customer_id', customerId),
          supabase.from('important_dates').delete().eq('customer_id', customerId),
          supabase.from('important_notables').delete().eq('customer_id', customerId),
          supabase.from('customer_notes').delete().eq('customer_id', customerId),
          supabase.from('connections').delete().eq('customer_id', customerId),
        ]);
      }

      // Insert all related data
      const insertPromises = [];

      // Insert tags
      if (formData.tags.length > 0) {
        const tagInserts = formData.tags.map(tag => ({
          customer_id: customer.id,
          tag_name: tag
        }));
        insertPromises.push(supabase.from('customer_tags').insert(tagInserts));
      }

      // Insert table preferences
      if (formData.tablePreferences.length > 0) {
        const tablePrefs = formData.tablePreferences.map(pref => ({
          customer_id: customer.id,
          preference: pref
        }));
        insertPromises.push(supabase.from('table_preferences').insert(tablePrefs));
      }

      // Insert food preferences
      if (formData.foodPreferences.length > 0) {
        const foodPrefs = formData.foodPreferences.map(pref => ({
          customer_id: customer.id,
          preference: pref.value,
          is_golden: pref.isGolden
        }));
        insertPromises.push(supabase.from('food_preferences').insert(foodPrefs));

        // Update preference options for autocomplete
        for (const pref of formData.foodPreferences) {
          await supabase.rpc('upsert_preference_option', {
            p_category: 'food',
            p_preference_text: pref.value
          });
        }
      }

      // Insert wine preferences
      if (formData.winePreferences.length > 0) {
        const winePrefs = formData.winePreferences.map(pref => ({
          customer_id: customer.id,
          preference: pref.value,
          is_golden: pref.isGolden
        }));
        insertPromises.push(supabase.from('wine_preferences').insert(winePrefs));

        for (const pref of formData.winePreferences) {
          await supabase.rpc('upsert_preference_option', {
            p_category: 'wine',
            p_preference_text: pref.value
          });
        }
      }

      // Insert cocktail preferences
      if (formData.cocktailPreferences.length > 0) {
        const cocktailPrefs = formData.cocktailPreferences.map(pref => ({
          customer_id: customer.id,
          preference: pref.value,
          is_golden: pref.isGolden
        }));
        insertPromises.push(supabase.from('cocktail_preferences').insert(cocktailPrefs));

        for (const pref of formData.cocktailPreferences) {
          await supabase.rpc('upsert_preference_option', {
            p_category: 'cocktail',
            p_preference_text: pref.value
          });
        }
      }

      // Insert spirits preferences
      if (formData.spiritsPreferences.length > 0) {
        const spiritsPrefs = formData.spiritsPreferences.map(pref => ({
          customer_id: customer.id,
          preference: pref.value,
          is_golden: pref.isGolden
        }));
        insertPromises.push(supabase.from('spirits_preferences').insert(spiritsPrefs));

        for (const pref of formData.spiritsPreferences) {
          await supabase.rpc('upsert_preference_option', {
            p_category: 'spirits',
            p_preference_text: pref.value
          });
        }
      }

      // Insert allergies
      if (formData.allergies.length > 0) {
        const allergyInserts = formData.allergies.map(allergy => ({
          customer_id: customer.id,
          allergy: allergy
        }));
        insertPromises.push(supabase.from('allergies').insert(allergyInserts));
      }

      // Insert important dates
      if (formData.importantDates.length > 0) {
        const dateInserts = formData.importantDates.map(dateItem => ({
          customer_id: customer.id,
          event: dateItem.event,
          date: dateItem.date
        }));
        insertPromises.push(supabase.from('important_dates').insert(dateInserts));
      }

      // Insert important notables
      if (formData.importantNotables.length > 0) {
        const notableInserts = formData.importantNotables.map(notable => ({
          customer_id: customer.id,
          notable: notable
        }));
        insertPromises.push(supabase.from('important_notables').insert(notableInserts));
      }

      // Insert notes
      if (formData.notes.trim()) {
        insertPromises.push(
          supabase.from('customer_notes').insert({
            customer_id: customer.id,
            note: formData.notes.trim()
          })
        );
      }

      // Handle connections
      if (formData.connections.length > 0) {
        for (const connection of formData.connections) {
          const { data: connectedCustomer } = await supabase
            .from('customers')
            .select('id')
            .eq('name', connection.name)
            .single();

          if (connectedCustomer) {
            insertPromises.push(
              supabase.from('connections').insert({
                customer_id: customer.id,
                connected_customer_id: connectedCustomer.id,
                relationship: connection.relationship
              })
            );
          }
        }
      }

      await Promise.all(insertPromises);
      console.log('Guest saved successfully:', customer);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitForm,
    isSubmitting,
  };
};
