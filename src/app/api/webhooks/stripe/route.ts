import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    let event;
    try {
      const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;
      const sigParts = signature.split(",").reduce<Record<string, string>>((acc, part) => {
        const [k, v] = part.split("=");
        acc[k] = v;
        return acc;
      }, {});

      const timestamp = parseInt(sigParts["t"] ?? "0", 10);
      const signatures = (sigParts["v1"] ?? "").split(" ");

      const expectedSig = await crypto.subtle
        .importKey(
          "raw",
          new TextEncoder().encode(webhookSecret),
          { name: "HMAC", hash: "SHA-256" },
          false,
          ["sign"],
        )
        .then((key) =>
          crypto.subtle.sign(
            "HMAC",
            key,
            new TextEncoder().encode(`${timestamp}.${rawBody}`),
          ),
        )
        .then((buf) =>
          Array.from(new Uint8Array(buf))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join(""),
        );

      if (!signatures.includes(expectedSig)) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }

      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Failed to verify webhook" }, { status: 400 });
    }

    const supabase = await createClient();

    switch (event.type) {
      case "payment_intent.succeeded":
      case "payment_intent.payment_succeeded": {
        const intent = event.data.object;
        await supabase
          .from("payments")
          .update({ status: "completed" })
          .eq("provider_payment_id", intent.id);
        break;
      }
      case "payment_intent.payment_failed": {
        const intent = event.data.object;
        await supabase
          .from("payments")
          .update({ status: "failed" })
          .eq("provider_payment_id", intent.id);
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object;
        await supabase
          .from("payments")
          .update({ status: "refunded" })
          .eq("provider_payment_id", charge.payment_intent);
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
