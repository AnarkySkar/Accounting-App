import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // First get the user
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("User fetch error:", userError);
      return NextResponse.json({ error: userError.message }, { status: 401 });
    }

    // Then get the company data
    const { data: companyData, error: companyError } = await supabase
      .from("companies")
      .select("*")
      .eq("id", userId)
      .single();

    if (companyError) {
      console.error("Company fetch error:", companyError);
      return NextResponse.json(
        { error: companyError.message },
        { status: 500 }
      );
    }

    if (!companyData) {
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json(companyData);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
