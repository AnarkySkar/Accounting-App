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
      await supabase.from("expenses").select().eq("company_id", userId);

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

// POST method for creating expenses
export async function POST(request: Request) {
  const supabase = createClient();
  const data = await request.json();

  const company_id = data.company_id;
  const date = data.date;
  const amount = data.amount;
  const description = data.description;
  const business_expense = data.business_expense;
  const personal_expense = data.personal_expense;
  const file = data.file;

  let fileUrl = null;

  try {
    if (file) {
      const { data: fileData, error: uploadError } = await supabase.storage
        .from("documents")
        .upload(`${company_id}/expenses/${Date.now()}-${file.name}`, file);

      if (uploadError) {
        console.error("File upload error:", uploadError);
        return NextResponse.json(
          { error: uploadError.message },
          { status: 500 }
        );
      }

      fileUrl = fileData.path;
    }

    const { data: expense, error: insertError } = await supabase
      .from("expenses")
      .insert({
        company_id,
        expense_date: date ? new Date(date).toISOString() : null,
        price: parseFloat(amount),
        description,
        file_url: fileUrl,
        business_expense: parseFloat(business_expense),
        personal_expense: parseFloat(personal_expense),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json(expense, { status: 201 });
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
    const { data: expense, error: updateError } = await supabase
      .from("expenses")
      .update({
        expense_date: data.date ? new Date(data.date).toISOString() : null,
        price: parseFloat(data.amount),
        description: data.description,
        file_url: data.file_url,
        business_expense: parseFloat(data.business_expense),
        personal_expense: parseFloat(data.personal_expense),
      })
      .eq("id", data.id)
      .select()
      .single();

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(expense);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
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
    const { data: expense, error: deleteError } = await supabase
      .from("expenses")
      .delete()
      .eq("id", data.id)
      .select()
      .single();

    if (deleteError) {
      console.error("Delete error:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json(expense);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
};
