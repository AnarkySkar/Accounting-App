import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client"; // Adjust the import path as necessary
import { PostgrestError } from "@supabase/supabase-js";
import { z } from "zod";

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const { data, error }: { data: any; error: PostgrestError | null } =
      await supabase.from("invoices").select().eq("company_id", userId);

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
    const { data: invoice, error: insertError } = await supabase
      .from("invoices")
      .insert({
        company_id: data.company_id,
        invoice_date: data.date ? new Date(data.date).toISOString() : null,
        price: parseFloat(data.amount),
        status: data.status,
        title: data.title,
        file_url: data.file_url, // Use the file URL from the client-side upload
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
