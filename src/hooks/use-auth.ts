'use client';

import { getApiErrorMessage } from '@/lib/api-error';
import { createClient } from '@/lib/supabase/client';
import { isValidPhone, normalizePhone } from '@/lib/utils';
import type { Profile } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { client } from '../../_dev/management-api';
import type { components } from '../../_dev/management-api-schema';

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

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    phone: string
  ) => {
    if (!isValidPhone(phone)) {
      throw new Error('Phone must be a valid 10-digit US number.');
    }

    const normalizedPhone = normalizePhone(phone);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: normalizedPhone,
        },
      },
    });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo:
          typeof window !== 'undefined'
            ? `${window.location.origin}/dashboard`
            : undefined,
      },
    });
    if (error) throw error;
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
    signIn,
    signUp,
    signInWithGoogle,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: profile?.is_admin ?? false,
  };
}

const getAuthConfig = async (projectRef: string) => {
  const { data, error } = await client.GET('/v1/projects/{ref}/config/auth', {
    params: {
      path: { ref: projectRef },
    },
  });
  if (error) {
    throw error;
  }

  return data;
};

export const useGetAuthConfig = (projectRef: string) => {
  return useQuery({
    queryKey: ['auth-config', projectRef],
    queryFn: () => getAuthConfig(projectRef),
    enabled: !!projectRef,
    retry: false,
  });
};

const updateAuthConfig = async ({
  projectRef,
  payload,
}: {
  projectRef: string;
  payload: components['schemas']['UpdateAuthConfigBody'];
}) => {
  const { data, error } = await client.PATCH('/v1/projects/{ref}/config/auth', {
    params: {
      path: {
        ref: projectRef,
      },
    },
    body: payload,
  });
  if (error) {
    throw error;
  }

  return data;
};

export const useUpdateAuthConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAuthConfig,
    onSuccess: (data, variables) => {
      toast.success(`Auth config updated.`);
      queryClient.invalidateQueries({
        queryKey: ['auth-config', variables.projectRef],
      });
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'There was a problem with your request.'));
    },
  });
};

export const useAuth = useAuthUser;
