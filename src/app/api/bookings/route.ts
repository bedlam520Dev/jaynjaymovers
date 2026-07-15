import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateEstimate } from "@/lib/mock-data";
import type { ServiceType, HomeSize, TimeWindow } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      service_type,
      home_size,
      moving_date,
      time_window,
      origin_address,
      destination_address,
      notes,
    } = body;

    if (!service_type || !home_size || !moving_date || !origin_address || !time_window) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const estimate = calculateEstimate(service_type as ServiceType, home_size as HomeSize);

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        service_type,
        home_size,
        moving_date,
        time_window: time_window as TimeWindow,
        origin_address,
        destination_address: destination_address || "",
        notes: notes || "",
        status: "pending",
        estimated_cost: estimate.total,
        crew_size: estimate.crewSize,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { error: slotError } = await supabase
      .from("time_slots")
      .select("id, current_bookings, max_bookings")
      .eq("date", moving_date)
      .eq("time_window", time_window)
      .maybeSingle();

    if (!slotError) {
      await supabase.rpc("increment_slot_booking", { slot_date: moving_date, slot_window: time_window }).then(() => {});
    }

    return NextResponse.json({ booking: data, estimate }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { booking_id, status } = body;

    if (!booking_id || !status) {
      return NextResponse.json({ error: "Missing booking_id or status" }, { status: 400 });
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

    const { data, error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", booking_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!profile?.is_admin && data.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ booking: data });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
