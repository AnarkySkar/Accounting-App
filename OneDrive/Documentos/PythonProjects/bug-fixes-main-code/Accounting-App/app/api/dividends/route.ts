import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client"; // Adjust the import path as necessary
import { PostgrestError } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const { data, error }: { data: any; error: PostgrestError | null } =
      await supabase.from("dividends").select().eq("company_id", userId);

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

// POST method for creating dividends
export async function POST(request: Request) {
  const supabase = createClient();
  const data = await request.json();

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const { data: dividend, error: insertError } = await supabase
      .from("dividends")
      .insert({
        company_id: data.company_id,
        date: data.date ? new Date(data.date).toISOString() : null,
        amount: parseFloat(data.amount),
        member_name: data.member_name,
        file_url: data.file_url,
      })
      .eq("company_id", userId)
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json(dividend, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export const PATCH = async (request: Request) => {
  const supabase = createClient();
  const data = await request.json();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const { data: dividend, error: updateError } = await supabase
      .from("dividends")
      .update({
        date: data.date ? new Date(data.date).toISOString() : null,
        amount: parseFloat(data.amount),
        member_name: data.member_name,
        file_url: data.file_url,
      })
      .eq("id", data.id)
      .select()
      .single();

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(dividend);
  } catch (error) {
    console.error("Unexpected error:", error);
  }
};

export const DELETE = async (request: Request) => {
  const supabase = createClient();
  const data = await request.json();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const { data: dividend, error: deleteError } = await supabase
      .from("dividends")
      .delete()
      .eq("id", data.id)
      .select()
      .single();

    if (deleteError) {
      console.error("Delete error:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json(dividend);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
};
