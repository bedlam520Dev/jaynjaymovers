'use client';

import { createClient } from '@/lib/supabase/client';
import type { TimeSlot } from '@/types';
import { useEffect, useState } from 'react';

type SlotChangePayload = {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: Partial<TimeSlot>;
  old: Partial<TimeSlot>;
};

export function useSchedule() {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    (async () => {
      try {
        const { data, error } = await supabase
          .from('time_slots')
          .select('*')
          .gte('date', new Date().toISOString().split('T')[0])
          .order('date', { ascending: true });
        if (error || !data) {
          setSlots([]);
        } else {
          setSlots(data as TimeSlot[]);
        }
      } catch {
        setSlots([]);
      } finally {
        setLoading(false);
      }
    })();

    // Live availability: keep current_bookings in sync with other customers.
    const channel = supabase
      .channel('time-slots-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'time_slots' },
        (payload: SlotChangePayload) => {
          const record = payload.new as Partial<TimeSlot>;
          if (!record.date || !record.time_window) return;
          setSlots((prev) => {
            const idx = prev.findIndex(
              (s) => s.date === record.date && s.time_window === record.time_window
            );
            if (idx === -1) {
              if (payload.eventType === 'DELETE') return prev;
              return [...prev, record as TimeSlot];
            }
            if (payload.eventType === 'DELETE') {
              return prev.filter((s) => s.id !== record.id);
            }
            const next = [...prev];
            next[idx] = { ...next[idx], ...record };
            return next;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { slots, loading };
}
