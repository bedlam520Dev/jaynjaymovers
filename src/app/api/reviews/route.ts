import { reviewSchema } from '@/lib/schemas/api';
import { createClient } from '@/lib/supabase/server';
import { verifyTurnstileToken } from '@/lib/turnstile';
import type { Review } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source');

  try {
    const supabase = await createClient();
    let query = supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    if (source) query = query.eq('source', source);
    const { data, error } = await query;

    if (error || !data) {
      return NextResponse.json({ reviews: [] });
    }

    return NextResponse.json({ reviews: data as Review[] });
  } catch {
    return NextResponse.json({ reviews: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = reviewSchema.parse(body);

    const ok = await verifyTurnstileToken(body.turnstile_token);
    if (!ok) {
      return NextResponse.json(
        { error: 'Security check failed. Please try again.' },
        { status: 403 }
      );
    }

    if (validated.rating < 1 || validated.rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
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

    if (!profile?.is_admin && validated.source !== 'internal') {
      return NextResponse.json(
        { error: 'Only admins can create external reviews' },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        source: validated.source,
        author_name: validated.author_name,
        rating: validated.rating,
        text: validated.text,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ review: data }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
