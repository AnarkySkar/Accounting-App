// @ts-nocheck

import { useToast } from "@/hooks/use-toast";
import { createInvoiceSchema } from "@/lib/schema";
import { GenInvoices, Invoice } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { z } from "zod";

type GenerateInvoiceParams = Omit<GenInvoices, "id" | "created_at"> &
  z.infer<typeof createInvoiceSchema> & { invDate: string };

const useGenerateInvoice = (company_id: string) => {
  const supabase = createClient();

  const { toast } = useToast();

  async function uploadPdfToSupabase(elementId: string, invoiceId: string) {
    const element = document.getElementById(elementId);

    if (!element) return;
    element.classList.add("hide-borders");

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdfWidth = canvas.width + 40;
    const pdfHeight = canvas.height + 40;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [pdfWidth, pdfHeight],
    });

    const xOffset = 20;
    const yOffset = 20;

    pdf.addImage(imgData, "PNG", xOffset, yOffset, canvas.width, canvas.height);
    const pdfBlob = pdf.output("blob");

    const { data, error } = await supabase.storage
      .from("documents")
      .upload(`${company_id}/invoices/${Date.now()}.pdf`, pdfBlob, {
        contentType: "application/pdf",
      });

    if (error) {
      throw error;
    }

    const pdfFile = data.path;

    const { data: invoiceData, error: invoiceError } = await supabase
      .from("invoices")
      .update({
        file_url: pdfFile,
      })
      .eq("id", invoiceId)
      .select("*")
      .single();

    if (invoiceError) {
      throw invoiceError;
    }

    return invoiceData;
  }

  const generateInvoice = async (data: GenerateInvoiceParams) => {
    // First, generate the invoice through the API
    const response = await fetch("/api/gen-invoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_id,
        ...data,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to generate invoice");
    }

    const invoiceData = await response.json();

    // Then handle the PDF generation and upload client-side
    return await uploadPdfToSupabase("invoice-form-prev", invoiceData.id);
  };

  return useMutation<Invoice, Error, GenerateInvoiceParams>({
    mutationFn: generateInvoice,
    onSuccess: () => console.log("Invoice generated successfully"),
    onError: (error) => {
      console.error("Invoice generation failed:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export { useGenerateInvoice };
