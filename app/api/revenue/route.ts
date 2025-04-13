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
      await supabase.from("revenue").select().eq("company_id", userId);

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

export async function POST(request: Request) {
  const supabase = createClient();
  const data = await request.json();

  try {
    // Create revenue
    const { data: revenue, error: insertError } = await supabase
      .from("revenue")
      .insert({
        company_id: data.company_id,
        date: data.date ? new Date(data.date).toISOString() : null,
        business_income: parseFloat(data.businessIncome),
        personal_income: parseFloat(data.personalIncome),
        file_url: data.file_url,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json(revenue, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const supabase = createClient();
  const data = await request.json();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id"); // Changed from userId to id

  if (!id) {
    return NextResponse.json(
      { error: "Revenue ID is required" },
      { status: 400 }
    );
  }

  try {
    const { data: updatedRevenue, error: updateError } = await supabase
      .from("revenue")
      .update({
        business_income: parseFloat(data.business_income),
        personal_income: parseFloat(data.personal_income),
        date: data.date ? new Date(data.date).toISOString() : null,
        ...(data.file_url ? { file_url: data.file_url } : {}),
      })
      .eq("id", id) // Using the revenue id
      .select("*")
      .single();

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(updatedRevenue);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
