import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";
import { SignUpFormData } from "@/types";

export async function POST(request: Request) {
  const supabase = createClient();
  const data: SignUpFormData = await request.json();

  try {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          address: data.address,
        },
      },
    });

    if (error) {
      console.error("Sign up error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(authData);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during sign up" },
      { status: 500 }
    );
  }
}
