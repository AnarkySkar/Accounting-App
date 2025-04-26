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

    try {
      // Handle file upload first
      if (data.file) {
        // Create a FormData object for the file upload
        const formData = new FormData();
        formData.append("file", data.file);
        formData.append("company_id", company_id);
        formData.append("folder", "invoices");

        // Upload the file using a dedicated file upload endpoint
        const uploadResponse = await fetch("/api/upload-file", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.message || "File upload failed");
        }

        const uploadResult = await uploadResponse.json();
        fileUrl = uploadResult.path;
        console.log("File uploaded successfully:", fileUrl);
      }

      // Then create the invoice record
      const response = await fetch("/api/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_id,
          date: data.date?.toISOString() || new Date().toISOString(),
          amount: data.amount,
          status: data.status,
          title: data.title,
          file_url: fileUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create invoice");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error in createInvoice:", error);
      throw error;
    }
  };

  return useMutation<Invoice, Error, z.infer<typeof createInvoiceSchema>>({
    mutationFn: createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({
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

const useGetCustomers = () => {
  const supabase = createClient();
  const { user } = useAuth();

  const getInvoices = async () => {
    const { data, error }: { data: any; error: PostgrestError | null } =
      await supabase.from("gen-invoices").select().eq("company_id", user.id);

    if (error) {
      throw new Error("Failed to fetch invoices");
    }

    const seen = new Set();

    const customers = data
      .map(({ customerAddress, customerCity, customerName }) =>
        (customerAddress, customerCity, customerName)
          ? {
              id: JSON.stringify({
                customerAddress,
                customerCity,
                customerName,
              }),
              customerAddress,
              customerCity,
              customerName,
            }
          : null
      )
      .filter(Boolean)
      .filter(({ id }) => {
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });

    return customers;
  };

  return useQuery<
    {
      id: string;
      customerAddress: string;
      customerCity: string;
      customerName: string;
    }[],
    PostgrestError
  >({
    queryFn: getInvoices,
    queryKey: ["getAllGenInvoices", user?.id],

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
  useGetCustomers,
};
