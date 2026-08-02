import { stripe } from '@/lib/payments';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
    }

    if (stripe.getStatus() !== 'configured') {
      return NextResponse.json(
        { error: 'Stripe webhook secret not configured' },
        { status: 500 }
      );
    }

    let event: Record<string, unknown>;
    try {
      const parsed = stripe.verifyWebhook(rawBody, signature);
      if (!parsed) {
        return NextResponse.json(
          { error: 'Invalid webhook signature' },
          { status: 401 }
        );
      }
      event = parsed;
    } catch {
      return NextResponse.json({ error: 'Failed to verify webhook' }, { status: 400 });
    }

    const supabase = await createClient();

    switch (event.type) {
      case 'payment_intent.succeeded':
      case 'payment_intent.payment_succeeded': {
        const intent = event.data as { object: { id: string } };
        await supabase
          .from('payments')
          .update({ status: 'completed' })
          .eq('provider_payment_id', intent.object.id);
        break;
      }
      case 'payment_intent.payment_failed': {
        const intent = event.data as { object: { id: string } };
        await supabase
          .from('payments')
          .update({ status: 'failed' })
          .eq('provider_payment_id', intent.object.id);
        break;
      }
      case 'charge.refunded': {
        const charge = event.data as { object: { payment_intent: string } };
        await supabase
          .from('payments')
          .update({ status: 'refunded' })
          .eq('provider_payment_id', charge.object.payment_intent);
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
