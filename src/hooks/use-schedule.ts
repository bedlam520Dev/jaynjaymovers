"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { generateMockTimeSlots, USE_MOCK_DATA } from "@/lib/mock-data";
import type { TimeSlot } from "@/types";

export function useSchedule() {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (USE_MOCK_DATA) {
        setSlots(generateMockTimeSlots());
        setLoading(false);
        return;
      }
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("time_slots")
          .select("*")
          .gte("date", new Date().toISOString().split("T")[0])
          .order("date", { ascending: true });
        if (error || !data || data.length === 0) {
          setSlots(generateMockTimeSlots());
        } else {
          setSlots(data as TimeSlot[]);
        }
      } catch {
        setSlots(generateMockTimeSlots());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { slots, loading };
}
