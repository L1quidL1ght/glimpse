
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePreferenceOptions = () => {
  const { data: foodOptions = [], isLoading: loadingFood } = useQuery({
    queryKey: ['food-preferences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('food_preference_options')
        .select('name')
        .order('name');
      
      if (error) throw error;
      return data.map(item => item.name);
    },
  });

  const { data: wineOptions = [], isLoading: loadingWine } = useQuery({
    queryKey: ['wine-preferences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wine_preference_options')
        .select('name')
        .order('name');
      
      if (error) throw error;
      return data.map(item => item.name);
    },
  });

  const { data: cocktailOptions = [], isLoading: loadingCocktail } = useQuery({
    queryKey: ['cocktail-preferences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cocktail_preference_options')
        .select('name')
        .order('name');
      
      if (error) throw error;
      return data.map(item => item.name);
    },
  });

  const { data: spiritsOptions = [], isLoading: loadingSpirits } = useQuery({
    queryKey: ['spirits-preferences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spirits_preference_options')
        .select('name')
        .order('name');
      
      if (error) throw error;
      return data.map(item => item.name);
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
