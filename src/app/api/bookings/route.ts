import { calculateEstimate } from '@/lib/pricing';
import { bookingSchema } from '@/lib/schemas/api';
import { createClient } from '@/lib/supabase/server';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = bookingSchema.parse(body);

    const ok = await verifyTurnstileToken(body.turnstile_token);
    if (!ok) {
      return NextResponse.json(
        { error: 'Security check failed. Please try again.' },
        { status: 403 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const estimate = calculateEstimate(validated.service_type, validated.home_size);

    const { data: reserved, error: reserveError } = await supabase.rpc('reserve_slot', {
      slot_date: validated.moving_date,
      slot_window: validated.time_window,
    });

    if (reserveError) {
      return NextResponse.json({ error: reserveError.message }, { status: 500 });
    }

    if (!reserved) {
      return NextResponse.json(
        { error: 'That time window just filled up. Please pick another slot.' },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        service_type: validated.service_type,
        home_size: validated.home_size,
        moving_date: validated.moving_date,
        time_window: validated.time_window,
        origin_address: validated.origin_address,
        destination_address: validated.destination_address || '',
        notes: validated.notes || '',
        status: 'pending',
        estimated_cost: estimate.total,
        crew_size: estimate.crewSize,
      })
      .select()
      .single();

    if (error) {
      await supabase.rpc('release_slot', {
        slot_date: validated.moving_date,
        slot_window: validated.time_window,
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ booking: data, estimate }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { booking_id, status } = body;

    if (!booking_id || !status) {
      return NextResponse.json(
        { error: 'Missing booking_id or status' },
        { status: 400 }
      );
    }

    const validStatuses = [
      'pending',
      'confirmed',
      'in_progress',
      'completed',
      'cancelled',
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle();

    let query = supabase.from('bookings').update({ status }).eq('id', booking_id);

    if (!profile?.is_admin) {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query.select().maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Booking not found or access denied' },
        { status: 404 }
      );
    }

    if (status === 'cancelled' && data.status !== 'cancelled') {
      await supabase.rpc('release_slot', {
        slot_date: data.moving_date,
        slot_window: data.time_window,
      });
    }

    return NextResponse.json({ booking: data });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
