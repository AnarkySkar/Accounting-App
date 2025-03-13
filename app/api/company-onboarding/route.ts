import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";
import { createLLCSchema } from "@/lib/schema";
import { z } from "zod";

// GET route for fetching LLC details
export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const { data, error }: { data: any; error: PostgrestError | null } =
      await supabase.from("companies").select().eq("id", userId).single();

    if (error) {
      console.error("Fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(null, { status: 404 });
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

// PATCH route for updating LLC details
export async function PATCH(request: Request) {
  const supabase = createClient();
  const data = await request.json();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Convert the ISO string back to a Date object before validation
    const dataToValidate = {
      ...data,
      date_incorporation: data.date_incorporation
        ? new Date(data.date_incorporation)
        : undefined,
    };

    // Validate the incoming data
    const validatedData = createLLCSchema.safeParse(dataToValidate);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.errors },
        { status: 400 }
      );
    }

    // Convert the Date back to ISO string for database storage
    const dataToUpdate = {
      ...validatedData.data,
      date_incorporation: validatedData.data.date_incorporation?.toISOString(),
    };

    // Update the company
    const { data: updatedLLC, error: updateError } = await supabase
      .from("companies")
      .update(dataToUpdate)
      .eq("id", userId)
      .select()
      .single();

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(updatedLLC);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
