import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, booking_id, method = "stripe" } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return NextResponse.json({
        clientSecret: null,
        paymentIntentId: null,
        message: "Stripe not configured — set STRIPE_SECRET_KEY to enable live payments",
      });
    }

    const response = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        amount: String(Math.round(amount * 100)),
        currency: "usd",
        "metadata[user_id]": user.id,
        "metadata[booking_id]": booking_id || "",
        "metadata[method]": method,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return NextResponse.json(
        { error: err.error?.message ?? "Stripe error" },
        { status: 502 },
      );
    }

    const intent = await response.json();

    await supabase.from("payments").insert({
      user_id: user.id,
      booking_id: booking_id || null,
      amount,
      method,
      status: "pending",
      provider_payment_id: intent.id,
    });

    return NextResponse.json({
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
