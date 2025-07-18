
import { supabase } from '@/integrations/supabase/client';
import { GuestFormData } from '@/hooks/useGuestForm';
import { AppErrorHandler, ErrorType } from '@/utils/errorHandling';

interface PreferenceItem {
  value: string;
  isGolden: boolean;
}

export const preferenceService = {
  async savePreferences(customerId: string, formData: GuestFormData) {
    if (!customerId) {
      throw AppErrorHandler.createError(
        ErrorType.VALIDATION,
        'Customer ID is required',
        'Cannot save preferences without a valid customer ID'
      );
    }

    const insertPromises = [];
    const errors: string[] = [];

    // Food preferences
    if (formData.foodPreferences.length > 0) {
      try {
        const foodPrefs = formData.foodPreferences.map(pref => ({
          customer_id: customerId,
          preference: pref.value.trim(),
          is_golden: pref.isGolden
        }));

        const { error } = await supabase.from('food_preferences').insert(foodPrefs);
        if (error) throw error;

        // Update preference options for autocomplete
        for (const pref of formData.foodPreferences) {
          try {
            await supabase.rpc('upsert_preference_option', {
              p_category: 'food',
              p_preference_text: pref.value.trim()
            });
          } catch (rpcError) {
            console.warn('Failed to update food preference option:', rpcError);
            // Don't fail the main operation for this
          }
        }
      } catch (error) {
        console.error('Failed to save food preferences:', error);
        errors.push('food preferences');
      }
    }

    // Wine preferences
    if (formData.winePreferences.length > 0) {
      try {
        const winePrefs = formData.winePreferences.map(pref => ({
          customer_id: customerId,
          preference: pref.value.trim(),
          is_golden: pref.isGolden
        }));

        const { error } = await supabase.from('wine_preferences').insert(winePrefs);
        if (error) throw error;

        for (const pref of formData.winePreferences) {
          try {
            await supabase.rpc('upsert_preference_option', {
              p_category: 'wine',
              p_preference_text: pref.value.trim()
            });
          } catch (rpcError) {
            console.warn('Failed to update wine preference option:', rpcError);
          }
        }
      } catch (error) {
        console.error('Failed to save wine preferences:', error);
        errors.push('wine preferences');
      }
    }

    // Cocktail preferences
    if (formData.cocktailPreferences.length > 0) {
      try {
        const cocktailPrefs = formData.cocktailPreferences.map(pref => ({
          customer_id: customerId,
          preference: pref.value.trim(),
          is_golden: pref.isGolden
        }));

        const { error } = await supabase.from('cocktail_preferences').insert(cocktailPrefs);
        if (error) throw error;

        for (const pref of formData.cocktailPreferences) {
          try {
            await supabase.rpc('upsert_preference_option', {
              p_category: 'cocktail',
              p_preference_text: pref.value.trim()
            });
          } catch (rpcError) {
            console.warn('Failed to update cocktail preference option:', rpcError);
          }
        }
      } catch (error) {
        console.error('Failed to save cocktail preferences:', error);
        errors.push('cocktail preferences');
      }
    }

    // Spirits preferences
    if (formData.spiritsPreferences.length > 0) {
      try {
        const spiritsPrefs = formData.spiritsPreferences.map(pref => ({
          customer_id: customerId,
          preference: pref.value.trim(),
          is_golden: pref.isGolden
        }));

        const { error } = await supabase.from('spirits_preferences').insert(spiritsPrefs);
        if (error) throw error;

        for (const pref of formData.spiritsPreferences) {
          try {
            await supabase.rpc('upsert_preference_option', {
              p_category: 'spirits',
              p_preference_text: pref.value.trim()
            });
          } catch (rpcError) {
            console.warn('Failed to update spirits preference option:', rpcError);
          }
        }
      } catch (error) {
        console.error('Failed to save spirits preferences:', error);
        errors.push('spirits preferences');
      }
    }

    // If there were errors, throw a combined error
    if (errors.length > 0) {
      throw AppErrorHandler.createError(
        ErrorType.DATABASE,
        `Failed to save some preferences: ${errors.join(', ')}`,
        'Some preference data could not be saved. You can try editing the customer to add missing preferences.'
      );
    }
  }
};
