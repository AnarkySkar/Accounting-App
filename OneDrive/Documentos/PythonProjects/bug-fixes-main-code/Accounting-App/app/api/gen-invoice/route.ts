import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createInvoiceSchema } from "@/lib/schema";
import { z } from "zod";
import { createClient } from "@/utils/supabase/client";

type GenerateInvoiceParams = {
  company_id: string;
  currency: string;
  customerAddress: string;
  customerCity: string;
  customerName: string;
  invDate: string;
  invoiceNumber: string;
  items: any[];
  notes: string;
  subtotal: number;
  tax: number;
  total: number;
  logo?: string;
  date?: Date;
  status: string;
  title: string;
};

export async function POST(request: Request) {
  const supabase = createClient();

  try {
    const data: GenerateInvoiceParams = await request.json();

    // First, create the gen-invoice record
    const { data: genInvoiceData, error: genInvoiceError } = await supabase
      .from("gen-invoices")
      .insert({
        company_id: data.company_id,
        currency: data.currency,
        customerAddress: data.customerAddress,
        customerCity: data.customerCity,
        customerName: data.customerName,
        date: data.invDate,
        invoiceNumber: data.invoiceNumber,
        items: data.items,
        notes: data.notes,
        subtotal: data.subtotal,
        tax: data.tax,
        total: data.total,
        logo: data.logo,
      })
      .select("*")
      .single();

    if (genInvoiceError) {
      console.error("Gen invoice error:", genInvoiceError);
      return NextResponse.json(
        { error: genInvoiceError.message },
        { status: 400 }
      );
    }

    // Then, create the invoice record
    const { data: invoiceData, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        company_id: data.company_id,
        invoice_date: data.date
          ? new Date(data.date).toISOString()
          : new Date().toISOString(),
        price: data.total,
        status: data.status,
        title: data.title,
        type: "custom",
        gen_invoice_id: genInvoiceData?.id,
      })
      .select("*")
      .single();

    if (invoiceError) {
      console.error("Invoice error:", invoiceError);
      return NextResponse.json(
        { error: invoiceError.message },
        { status: 400 }
      );
    }

    // Note: PDF generation and upload should still be handled client-side
    // because it requires DOM manipulation (html2canvas)

    return NextResponse.json(invoiceData);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while generating invoice" },
      { status: 500 }
    );
  }
}
