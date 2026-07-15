"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MOCK_QUOTE_REQUESTS, USE_MOCK_DATA } from "@/lib/mock-data";
import { useAuth } from "@/hooks/use-auth";
import type { QuoteRequest } from "@/types";

export function useQuoteRequests() {
  const { user, profile } = useAuth();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (USE_MOCK_DATA || !user || !profile?.is_admin) {
        setQuotes(MOCK_QUOTE_REQUESTS);
        setLoading(false);
        return;
      }
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("quote_requests")
          .select("*")
          .order("created_at", { ascending: false });
        if (error || !data || data.length === 0) {
          setQuotes(MOCK_QUOTE_REQUESTS);
        } else {
          setQuotes(data as QuoteRequest[]);
        }
      } catch {
        setQuotes(MOCK_QUOTE_REQUESTS);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, profile]);

  return { quotes, loading };
}
