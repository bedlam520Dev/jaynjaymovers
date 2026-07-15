import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateEstimate } from "@/lib/mock-data";
import type { ServiceType, HomeSize } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      service_type,
      home_size,
      moving_date,
      origin_address,
      destination_address,
      contact_name,
      contact_phone,
      contact_email,
      notes,
    } = body;

    if (!service_type || !home_size || !origin_address || !contact_name || !contact_phone || !contact_email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const estimate = calculateEstimate(service_type as ServiceType, home_size as HomeSize);

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const insertData = {
      user_id: user?.id ?? null,
      service_type,
      home_size,
      moving_date: moving_date || null,
      origin_address,
      destination_address: destination_address || "",
      contact_name,
      contact_phone,
      contact_email,
      notes: notes || "",
      status: "new",
    };

    const { data, error } = await supabase
      .from("quote_requests")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { quote: data, estimate },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
