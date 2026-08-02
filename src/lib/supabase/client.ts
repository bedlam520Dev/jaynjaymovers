import { createBrowserClient } from '@supabase/ssr';

const isSupabaseEnabled = process.env.NEXT_PUBLIC_ENABLE_SUPABASE === 'true';

export function createClient() {
  if (!isSupabaseEnabled) {
    return new Proxy({} as any, {
      get: (_, prop) => {
        if (prop === 'auth') {
          return {
            getUser: async () => ({ data: { user: null }, error: null }),
            onAuthStateChange: () => ({
              data: { subscription: { unsubscribe: () => { } } },
            }),
            signInWithPassword: async () => ({
              data: { user: null },
              error: { message: 'Supabase is disabled' },
            }),
            signUp: async () => ({
              data: { user: null },
              error: { message: 'Supabase is disabled' },
            }),
            signInWithOAuth: async () => ({ data: null, error: null }),
            signOut: async () => ({ error: null }),
          };
        }
        if (prop === 'channel') {
          return () => ({ on: () => ({ subscribe: () => ({ unsubscribe: () => { } }) }) });
        }
        if (prop === 'removeChannel') {
          return () => { };
        }
        return () => ({
          select: () => ({
            eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }),
          }),
        });
      },
    });
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
