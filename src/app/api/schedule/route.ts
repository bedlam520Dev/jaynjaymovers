import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateMockTimeSlots, USE_MOCK_DATA } from "@/lib/mock-data";
import type { TimeSlot } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (USE_MOCK_DATA) {
    const slots = generateMockTimeSlots();
    const filtered = date ? slots.filter((s) => s.date === date) : slots;
    return NextResponse.json({ slots: filtered });
  }

  try {
    const supabase = await createClient();
    let query = supabase
      .from("time_slots")
      .select("*")
      .gte("date", new Date().toISOString().split("T")[0])
      .order("date", { ascending: true });

    if (date) query = query.eq("date", date);

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return NextResponse.json({ slots: generateMockTimeSlots() });
    }

    return NextResponse.json({ slots: data as TimeSlot[] });
  } catch {
    return NextResponse.json({ slots: generateMockTimeSlots() });
  }
}
