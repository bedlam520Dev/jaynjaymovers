import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MOCK_PAYMENTS, USE_MOCK_DATA } from "@/lib/mock-data";
import type { Payment, PaymentMethod } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const method = searchParams.get("method");

  if (USE_MOCK_DATA) {
    const filtered = method ? MOCK_PAYMENTS.filter((p) => p.method === method) : MOCK_PAYMENTS;
    return NextResponse.json({ payments: filtered });
  }

  try {
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

    let query = supabase.from("payments").select("*").order("created_at", { ascending: false });
    if (!profile?.is_admin) {
      query = query.eq("user_id", user.id);
    }
    if (method) query = query.eq("method", method);

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return NextResponse.json({ payments: profile?.is_admin ? MOCK_PAYMENTS : [] });
    }

    return NextResponse.json({ payments: data as Payment[] });
  } catch {
    return NextResponse.json({ payments: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { booking_id, amount, method } = body;

    if (!amount || !method) {
      return NextResponse.json({ error: "Missing amount or method" }, { status: 400 });
    }

    const validMethods: PaymentMethod[] = [
      "stripe", "paypal", "cashapp", "googlepay", "applepay", "zelle", "crypto", "cash", "check",
    ];
    if (!validMethods.includes(method)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("payments")
      .insert({
        user_id: user.id,
        booking_id: booking_id || null,
        amount,
        method,
        status: "pending",
        provider_payment_id: "",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ payment: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
