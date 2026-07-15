"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MOCK_PAYMENTS, USE_MOCK_DATA } from "@/lib/mock-data";
import { useAuth } from "@/hooks/use-auth";
import type { Payment } from "@/types";

export function usePayments() {
  const { user, profile } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (USE_MOCK_DATA || !user) {
        setPayments(profile?.is_admin ? MOCK_PAYMENTS : USE_MOCK_DATA ? MOCK_PAYMENTS.slice(0, 2) : []);
        setLoading(false);
        return;
      }
      try {
        const supabase = createClient();
        let query = supabase.from("payments").select("*").order("created_at", { ascending: false });
        if (!profile?.is_admin) {
          query = query.eq("user_id", user.id);
        }
        const { data, error } = await query;
        if (error || !data || data.length === 0) {
          setPayments(profile?.is_admin ? MOCK_PAYMENTS : []);
        } else {
          setPayments(data as Payment[]);
        }
      } catch {
        setPayments(profile?.is_admin ? MOCK_PAYMENTS : []);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, profile]);

  return { payments, loading };
}
