'use client';

import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import type { QuoteRequest } from '@/types';
import { useEffect, useState } from 'react';

export function useQuoteRequests() {
  const { user, profile } = useAuth();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!user || !profile?.is_admin) {
        setQuotes([]);
        setLoading(false);
        return;
      }
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('quote_requests')
          .select('*')
          .order('created_at', { ascending: false });
        if (error || !data) {
          setQuotes([]);
        } else {
          setQuotes(data as QuoteRequest[]);
        }
      } catch {
        setQuotes([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, profile]);

  return { quotes, loading };
}
