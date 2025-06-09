
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePreferenceOptions = () => {
  const { data: foodOptions = [], isLoading: loadingFood } = useQuery({
    queryKey: ['food-preferences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('preference_options')
        .select('preference_text')
        .eq('category', 'food')
        .order('usage_count', { ascending: false });
      
      if (error) throw error;
      return data.map(item => item.preference_text);
    },
  });

  const { data: wineOptions = [], isLoading: loadingWine } = useQuery({
    queryKey: ['wine-preferences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('preference_options')
        .select('preference_text')
        .eq('category', 'wine')
        .order('usage_count', { ascending: false });
      
      if (error) throw error;
      return data.map(item => item.preference_text);
    },
  });

  const { data: cocktailOptions = [], isLoading: loadingCocktail } = useQuery({
    queryKey: ['cocktail-preferences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('preference_options')
        .select('preference_text')
        .eq('category', 'cocktail')
        .order('usage_count', { ascending: false });
      
      if (error) throw error;
      return data.map(item => item.preference_text);
    },
  });

  const { data: spiritsOptions = [], isLoading: loadingSpirits } = useQuery({
    queryKey: ['spirits-preferences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('preference_options')
        .select('preference_text')
        .eq('category', 'spirits')
        .order('usage_count', { ascending: false });
      
      if (error) throw error;
      return data.map(item => item.preference_text);
    },
  });

  return {
    foodOptions,
    wineOptions,
    cocktailOptions,
    spiritsOptions,
    isLoading: loadingFood || loadingWine || loadingCocktail || loadingSpirits,
  };
};
