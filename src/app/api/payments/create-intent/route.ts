import { createPaymentIntent, getProviderConfig } from '@/lib/payments';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, booking_id, method = 'credit_card' } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const config = getProviderConfig(method);
    if (!config.configured) {
      return NextResponse.json(
        {
          clientSecret: null,
          paymentIntentId: null,
          provider: config.name,
          message: config.message,
        },
        { status: 200 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await createPaymentIntent({
      amount,
      booking_id,
      method,
      metadata: { user_id: user.id, method },
    });

    if (result.message) {
      return NextResponse.json(result, { status: 200 });
    }

    if (result.paymentIntentId) {
      await supabase.from('payments').insert({
        user_id: user.id,
        booking_id: booking_id || null,
        amount,
        method,
        status: 'pending',
        provider_payment_id: result.paymentIntentId,
      });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
