import { createClient } from '@/lib/supabase/server';
import type { TimeSlot } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  try {
    const supabase = await createClient();
    let query = supabase
      .from('time_slots')
      .select('*')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (date) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        return NextResponse.json(
          { error: 'Invalid date format. Use YYYY-MM-DD.' },
          { status: 400 }
        );
      }
      query = query.eq('date', date);
    }

    const { data, error } = await query;

    if (error || !data) {
      return NextResponse.json({ slots: [] });
    }

    return NextResponse.json({ slots: data as TimeSlot[] });
  } catch {
    return NextResponse.json({ slots: [] });
  }
}
