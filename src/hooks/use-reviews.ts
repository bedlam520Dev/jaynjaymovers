'use client';

import { createClient } from '@/lib/supabase/client';
import type { Review } from '@/types';
import { useEffect, useState } from 'react';

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });
        if (error || !data) {
          setReviews([]);
        } else {
          setReviews(data as Review[]);
        }
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { reviews, loading };
}
