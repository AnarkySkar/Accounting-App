import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const filterType = searchParams.get("filterType");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase.rpc("get_dashboard_data", {
      filter_type: filterType?.startsWith("custom")
        ? "custom"
        : (filterType ?? ""),
      company: userId,
      ...(startDate ? { start_date: startDate } : {}),
      ...(endDate ? { end_date: endDate } : {}),
    });

    if (error) {
      console.error("Fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
