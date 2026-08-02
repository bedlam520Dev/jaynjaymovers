import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const isSupabaseEnabled = process.env.NEXT_PUBLIC_ENABLE_SUPABASE === 'true';

class MockQuery {
  select() {
    return this;
  }
  eq() {
    return this;
  }
  maybeSingle() {
    return Promise.resolve({ data: null, error: null });
  }
  single() {
    return Promise.resolve({ data: null, error: null });
  }
  insert() {
    return this;
  }
  update() {
    return this;
  }
  delete() {
    return this;
  }
  order() {
    return this;
  }
  gte() {
    return this;
  }
  limit() {
    return this;
  }
}

const mockQuery = new MockQuery();

export async function createClient() {
  if (!isSupabaseEnabled) {
    return new Proxy({} as any, {
      get: (_, prop) => {
        if (prop === 'auth') {
          return {
            getUser: async () => ({ data: { user: null }, error: null }),
            onAuthStateChange: () => ({
              data: { subscription: { unsubscribe: () => { } } },
            }),
          };
        }
        if (prop === 'from') {
          return () => mockQuery;
        }
        if (prop === 'rpc') {
          return async () => ({ data: null, error: null });
        }
        return () => mockQuery;
      },
    });
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
          }
        },
      },
    }
  );
}
