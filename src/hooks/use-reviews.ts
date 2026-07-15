"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MOCK_REVIEWS, USE_MOCK_DATA } from "@/lib/mock-data";
import type { Review } from "@/types";

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (USE_MOCK_DATA) {
        setReviews(MOCK_REVIEWS);
        setLoading(false);
        return;
      }
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .order("created_at", { ascending: false });
        if (error || !data || data.length === 0) {
          setReviews(MOCK_REVIEWS);
        } else {
          setReviews(data as Review[]);
        }
      } catch {
        setReviews(MOCK_REVIEWS);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { reviews, loading };
}
