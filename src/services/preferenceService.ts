
import { supabase } from '@/integrations/supabase/client';
import { GuestFormData } from '@/hooks/useGuestForm';

interface PreferenceItem {
  value: string;
  isGolden: boolean;
}

export const preferenceService = {
  async savePreferences(customerId: string, formData: GuestFormData) {
    const insertPromises = [];

    // Food preferences
    if (formData.foodPreferences.length > 0) {
      const foodPrefs = formData.foodPreferences.map(pref => ({
        customer_id: customerId,
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

    // Wine preferences
    if (formData.winePreferences.length > 0) {
      const winePrefs = formData.winePreferences.map(pref => ({
        customer_id: customerId,
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

    // Cocktail preferences
    if (formData.cocktailPreferences.length > 0) {
      const cocktailPrefs = formData.cocktailPreferences.map(pref => ({
        customer_id: customerId,
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

    // Spirits preferences
    if (formData.spiritsPreferences.length > 0) {
      const spiritsPrefs = formData.spiritsPreferences.map(pref => ({
        customer_id: customerId,
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

    await Promise.all(insertPromises);
  }
};
