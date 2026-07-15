import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { payment_id, status, provider_payment_id } = body;

    if (!payment_id || !status) {
      return NextResponse.json({ error: "Missing payment_id or status" }, { status: 400 });
    }

    const validStatuses = ["pending", "completed", "failed", "refunded"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
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

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden — admin only" }, { status: 403 });
    }

    const updateData: Record<string, string> = { status };
    if (provider_payment_id) updateData.provider_payment_id = provider_payment_id;

    const { data, error } = await supabase
      .from("payments")
      .update(updateData)
      .eq("id", payment_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ payment: data });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
