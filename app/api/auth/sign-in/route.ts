import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";
import { SignInFormData } from "@/types";

export async function POST(request: Request) {
  const supabase = createClient();
  const data: SignInFormData = await request.json();

  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      console.error("Sign in error:", error);
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(authData);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during sign in" },
      { status: 500 }
    );
  }
}
