import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Remove the old config export
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// For file uploads in App Router, you don't need to disable bodyParser anymore
// The formData() method handles this automatically

export async function POST(request: Request) {
  try {
    // Create Supabase client with service role key to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key instead
      {
        auth: { persistSession: false },
      }
    );

    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const company_id = formData.get("company_id") as string;
    const folder = formData.get("folder") as string;

    if (!file || !company_id || !folder) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert the file to an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Generate a unique filename
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${company_id}/${folder}/${fileName}`;

    console.log("Attempting to upload file:", filePath);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("documents")
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase storage error:", error);
      return NextResponse.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 }
      );
    }

    console.log("File uploaded successfully:", data.path);

    // Return the file path
    return NextResponse.json({ path: data.path });
  } catch (error) {
    console.error("Unexpected error during file upload:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during file upload" },
      { status: 500 }
    );
  }
}
