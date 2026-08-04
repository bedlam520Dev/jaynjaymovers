import { calculateEstimate } from '@/lib/pricing';
import { quoteSchema } from '@/lib/schemas/api';
import { createClient } from '@/lib/supabase/server';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = quoteSchema.parse(body);

    const ok = await verifyTurnstileToken(body.turnstile_token);
    if (!ok) {
      return NextResponse.json(
        { error: 'Security check failed. Please try again.' },
        { status: 403 }
      );
    }

    const estimate = calculateEstimate(validated.service_type, validated.home_size);

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const insertData = {
      user_id: user?.id ?? null,
      service_type: validated.service_type,
      home_size: validated.home_size,
      moving_date: validated.moving_date || null,
      origin_address: validated.origin_address,
      destination_address: validated.destination_address || '',
      contact_name: validated.contact_name,
      contact_phone: validated.contact_phone,
      contact_email: validated.contact_email,
      notes: validated.notes || '',
      status: 'new',
    };

    const { data, error } = await supabase
      .from('quote_requests')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ quote: data, estimate }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
