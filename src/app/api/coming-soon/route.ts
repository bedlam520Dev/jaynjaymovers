import { newsletterSchema } from '@/lib/schemas/api';
import { createClient } from '@/lib/supabase/server';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = newsletterSchema.parse(body);

    const ok = await verifyTurnstileToken(body.turnstile_token);
    if (!ok) {
      return NextResponse.json(
        { error: 'Security check failed. Please try again.' },
        { status: 403 }
      );
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: validated.email.toLowerCase() });

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { message: "You're already on the list!" },
          { status: 200 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Success! You have been subscribed.' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
