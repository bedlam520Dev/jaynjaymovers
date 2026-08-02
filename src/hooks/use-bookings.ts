'use client';

import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import type { Booking } from '@/types';
import { useEffect, useState } from 'react';

export function useBookings() {
  const { user, profile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!user) {
        setBookings([]);
        setLoading(false);
        return;
      }
      try {
        const supabase = createClient();
        let query = supabase
          .from('bookings')
          .select('*')
          .order('moving_date', { ascending: true });
        if (!profile?.is_admin) {
          query = query.eq('user_id', user.id);
        }
        const { data, error } = await query;
        if (error) {
          setBookings([]);
        } else {
          setBookings(data as Booking[]);
        }
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, profile]);

  return { bookings, loading };
}
