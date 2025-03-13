// @ts-nocheck

import { createInvoiceSchema } from "@/lib/schema";
import { CreateInvoiceBody, Invoice } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";

// const useCreateInvoice = (company_id: string) => {
//   const supabase = createClient();

//   const queryClient = useQueryClient();

//   const createInvoice = async (data: z.infer<typeof createInvoiceSchema>) => {
//     let fileUrl = null;

//     if (data.file) {
//       const { data: fileData, error } = await supabase.storage
//         .from("documents")
//         .upload(
//           `${company_id}/invoices/${Date.now()}-${data.file.name}`,
//           data.file
//         );

//       if (error) throw error;
//       fileUrl = fileData.path;
//     }

//     const { data: invoice, error } = await supabase.from("invoices").insert({
//       company_id,
//       invoice_date: data.date?.toISOString(),
//       price: parseFloat(data.amount),
//       status: data.status,
//       title: data.title,
//       file_url: fileUrl,
//     });

//     if (error) {
//       console.error("Supabase insert error:", error);

//       throw error;
//     }

//     return invoice;
//   };

//   return useMutation<
//     Invoice,
//     PostgrestError,
//     z.infer<typeof createInvoiceSchema>
//   >({
//     mutationFn: (data) => createInvoice(data),
//     mutationKey: ["create-invoice", company_id],
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["getInvoices", company_id],
//       });
//     },
//     onError: (error) => {
//       console.error("Mutation error:", error);
//     },
//   });
// };

const useCreateInvoice = (company_id: string) => {
  const queryClient = useQueryClient();
  const supabase = createClient();

  const createInvoice = async (data: z.infer<typeof createInvoiceSchema>) => {
    let fileUrl = null;

    // Handle file upload first using client-side Supabase
    if (data.file) {
      const { data: fileData, error: uploadError } = await supabase.storage
        .from("documents")
        .upload(
          `${company_id}/invoices/${Date.now()}-${data.file.name}`,
          data.file
        );

      if (uploadError) {
        throw new Error("File upload failed: " + uploadError.message);
      }
      fileUrl = fileData.path;
    }

    // Then send the rest of the data including the file URL
    const response = await fetch("/api/invoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_id,
        date: data.date?.toISOString() || "",
        amount: data.amount,
        status: data.status,
        title: data.title,
        file_url: fileUrl,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create invoice");
    }

    return response.json();
  };

  return useMutation<Invoice, Error, z.infer<typeof createInvoiceSchema>>({
    mutationFn: createInvoice,
    mutationKey: ["create-invoice", company_id],
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["getAllInvoices", company_id],
      });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });
};

const useEditInvoice = (id: string) => {
  const supabase = createClient();

  const { user } = useAuth();

  const queryClient = useQueryClient();

  const editInvoice = async (data: z.infer<typeof createInvoiceSchema>) => {
    let fileUrl = null;

    if (data.file) {
      const { data: fileData, error } = await supabase.storage
        .from("documents")
        .upload(
          `${user?.id}/invoice/${Date.now()}-${data.file.name}`,
          data.file
        );

      if (error) throw error;
      fileUrl = fileData.path;
    }

    const { data: invoice, error } = await supabase
      .from("invoices")
      .update({
        invoice_date: data.date?.toISOString(),
        price: parseFloat(data.amount),
        status: data.status,
        title: data.title,
        ...(fileUrl ? { file_url: fileUrl } : {}),
      })
      .eq("id", id);

    if (error) {
      throw error;
    }

    return invoice;
  };

  return useMutation<
    Invoice,
    PostgrestError,
    z.infer<typeof createInvoiceSchema>
  >({
    mutationFn: (data) => editInvoice(data),
    mutationKey: ["edit-invoice", id],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getAllInvoices", user?.id],
      });
    },
  });
};

const useGetInvoices = () => {
  const supabase = createClient();
  const { user } = useAuth();

  // const getInvoices = async () => {
  //   const { data, error } = await supabase
  //     .from("invoices")
  //     .select()
  //     .eq("company_id", user?.id);

  //   if (error) {
  //     throw error;
  //   }

  //   return data;
  // };
  const getInvoices = async () => {
    const response = await fetch(`/api/invoice?userId=${user?.id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch invoices");
    }
    return response.json();
  };

  return useQuery<Invoice[], PostgrestError>({
    queryFn: getInvoices,
    queryKey: ["getAllInvoices", user?.id],

    enabled: !!user?.id,
  });
};

const useGetInvoice = (id: string) => {
  const supabase = createClient();
  const getInvoice = async () => {
    const { data, error } = await supabase
      .from("invoices")
      .select()
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  };

  return useQuery<Invoice, PostgrestError>({
    queryFn: getInvoice,
    queryKey: ["getInvoice", id],

    enabled: !!id,
  });
};

const useDeleteInvoice = () => {
  const supabase = createClient();

  const { user } = useAuth();

  const queryClient = useQueryClient();

  const deleteInvoice = async (id: string) => {
    const { error } = await supabase.from("invoices").delete().eq("id", id);

    if (error) {
      throw error;
    }
  };

  return useMutation<void, PostgrestError, { id: string }>({
    mutationFn: (data) => deleteInvoice(data.id),
    mutationKey: ["delete-invoice", user?.id],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getAllInvoices", user?.id],
      });
    },
  });
};

export {
  useCreateInvoice,
  useGetInvoices,
  useDeleteInvoice,
  useGetInvoice,
  useEditInvoice,
};
