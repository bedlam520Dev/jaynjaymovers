import { paymentSchema } from '@/lib/schemas/api';
import { createClient } from '@/lib/supabase/server';
import type { Payment } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const method = searchParams.get('method');

  try {
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

    let query = supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });
    if (!profile?.is_admin) {
      query = query.eq('user_id', user.id);
    }
    if (method) query = query.eq('method', method);

    const { data, error } = await query;

    if (error || !data) {
      return NextResponse.json({ payments: [] });
    }

    return NextResponse.json({ payments: data as Payment[] });
  } catch {
    return NextResponse.json({ payments: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = paymentSchema.parse(body);

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        booking_id: validated.booking_id || null,
        amount: validated.amount,
        method: validated.method,
        status: 'pending',
        provider_payment_id: '',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ payment: data }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
