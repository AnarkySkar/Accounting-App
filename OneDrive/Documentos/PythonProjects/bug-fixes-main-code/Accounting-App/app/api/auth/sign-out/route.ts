import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function POST(request: Request) {
  const supabase = createClient();

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error);
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    const response = NextResponse.json({ message: "Signed out successfully" });

    return response;
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during sign out" },
      { status: 500 }
    );
  }
}
