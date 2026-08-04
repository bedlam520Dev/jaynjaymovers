'use client';

import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

function useAuthUser() {
  const supabase = createClient();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) return null;
      return data.user;
    },
    staleTime: 1000 * 60 * 5,
  });

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['auth-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .limit(1);
      if (error) return null;
      return (data?.[0] ?? null) as Profile | null;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const queryClient = useQueryClient();

  const updateProfile = async (updates: {
    full_name?: string;
    phone?: string;
    avatar_url?: string | null;
  }) => {
    if (!user?.id) throw new Error('Not authenticated');
    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
    if (error) throw error;
    queryClient.invalidateQueries({ queryKey: ['auth-profile'] });
  };

  const loading = userLoading || profileLoading;

  return {
    user,
    profile,
    loading,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: profile?.is_admin ?? false,
  };
}

export const useAuth = useAuthUser;
