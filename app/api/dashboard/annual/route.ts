import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const year = searchParams.get("year") || new Date().getFullYear().toString();

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase.rpc("get_annual_financials", {
      company: userId,
      year: parseInt(year),
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
