import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MOCK_REVIEWS, USE_MOCK_DATA } from "@/lib/mock-data";
import type { Review } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source");

  if (USE_MOCK_DATA) {
    const filtered = source ? MOCK_REVIEWS.filter((r) => r.source === source) : MOCK_REVIEWS;
    return NextResponse.json({ reviews: filtered });
  }

  try {
    const supabase = await createClient();
    let query = supabase.from("reviews").select("*").order("created_at", { ascending: false });
    if (source) query = query.eq("source", source);
    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return NextResponse.json({ reviews: MOCK_REVIEWS });
    }

    return NextResponse.json({ reviews: data as Review[] });
  } catch {
    return NextResponse.json({ reviews: MOCK_REVIEWS });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { author_name, rating, text, source = "internal" } = body;

    if (!author_name || !rating || !text) {
      return NextResponse.json(
        { error: "Missing required fields: author_name, rating, text" },
        { status: 400 },
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    if (USE_MOCK_DATA) {
      const review: Review = {
        id: `mock-rv-${Date.now()}`,
        source,
        author_name,
        author_avatar: "",
        rating,
        text,
        external_url: null,
        created_at: new Date().toISOString(),
      };
      return NextResponse.json({ review }, { status: 201 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile?.is_admin && source !== "internal") {
      return NextResponse.json(
        { error: "Only admins can create external reviews" },
        { status: 403 },
      );
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert({ source, author_name, rating, text })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ review: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
