"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MOCK_BOOKINGS, USE_MOCK_DATA } from "@/lib/mock-data";
import { useAuth } from "@/hooks/use-auth";
import type { Booking } from "@/types";

export function useBookings() {
  const { user, profile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (USE_MOCK_DATA || !user) {
        setBookings(profile?.is_admin ? MOCK_BOOKINGS : USE_MOCK_DATA ? MOCK_BOOKINGS.slice(0, 3) : []);
        setLoading(false);
        return;
      }
      try {
        const supabase = createClient();
        let query = supabase.from("bookings").select("*").order("moving_date", { ascending: true });
        if (!profile?.is_admin) {
          query = query.eq("user_id", user.id);
        }
        const { data, error } = await query;
        if (error || !data || data.length === 0) {
          setBookings(profile?.is_admin ? MOCK_BOOKINGS : []);
        } else {
          setBookings(data as Booking[]);
        }
      } catch {
        setBookings(profile?.is_admin ? MOCK_BOOKINGS : []);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, profile]);

  return { bookings, loading };
}
