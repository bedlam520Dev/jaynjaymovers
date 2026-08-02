'use client';

import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import type { Payment } from '@/types';
import { useEffect, useState } from 'react';

export function usePayments() {
  const { user, profile } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!user) {
        setPayments([]);
        setLoading(false);
        return;
      }
      try {
        const supabase = createClient();
        let query = supabase
          .from('payments')
          .select('*')
          .order('created_at', { ascending: false });
        if (!profile?.is_admin) {
          query = query.eq('user_id', user.id);
        }
        const { data, error } = await query;
        if (error) {
          setPayments([]);
        } else {
          setPayments(data as Payment[]);
        }
      } catch {
        setPayments([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, profile]);

  return { payments, loading };
}
