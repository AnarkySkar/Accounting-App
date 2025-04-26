// @ts-nocheck

import { createExpenseSchema } from "@/lib/schema";
import { Expenses } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";

// const useCreateExpense = (company_id: string) => {
//   const supabase = createClient();

//   const queryClient = useQueryClient();

//   const createExpense = async (data: z.infer<typeof createExpenseSchema>) => {
//     let fileUrl = null;

//     if (data.file) {
//       const { data: fileData, error } = await supabase.storage
//         .from("documents")
//         .upload(
//           `${company_id}/expenses/${Date.now()}-${data.file.name}`,
//           data.file
//         );

//       if (error) throw error;
//       fileUrl = fileData.path;
//     }

//     const { data: invoice, error } = await supabase.from("expenses").insert({
//       company_id,
//       expense_date: data.date?.toISOString(),
//       price: parseFloat(data.amount),
//       description: data.description,
//       file_url: fileUrl,
//       business_expense: parseFloat(data.business_expense),
//       personal_expense: parseFloat(data.personal_expense),
//     });

//     if (error) {
//       throw error;
//     }

//     return invoice;
//   };

//   return useMutation<
//     Expenses,
//     PostgrestError,
//     z.infer<typeof createExpenseSchema>
//   >({
//     mutationFn: (data) => createExpense(data),
//     mutationKey: ["create-expense", company_id],
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["getExpenses", company_id],
//       });
//     },
//   });
// };

const useCreateExpense = (company_id: string) => {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const createExpense = async (data: z.infer<typeof createExpenseSchema>) => {
    let fileUrl = null;

    if (data.file) {
      // Create a FormData object for the file upload
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("company_id", company_id);
      formData.append("folder", "expenses");

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

    const response = await fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_id,
        date: data.date?.toISOString() || "",
        amount: data.amount,
        description: data.description,
        business_expense: data.business_expense,
        personal_expense: data.personal_expense,
        file_url: fileUrl,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create expense");
    }

    return response.json();
  };

  return useMutation<Expenses, Error, z.infer<typeof createExpenseSchema>>({
    mutationFn: createExpense,
    mutationKey: ["create-expense", company_id],
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["getExpenses", company_id],
      });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });
};

const useGetExpenses = () => {
  const supabase = createClient();

  const { user } = useAuth();

  // const getExpenses = async () => {
  //   const { data, error } = await supabase
  //     .from("expenses")
  //     .select()
  //     .eq("company_id", user?.id!);

  //   if (error) {
  //     console.error("Fetch error:", error);
  //     throw error;
  //   }

  //   return data;
  // };
  const getExpenses = async () => {
    const response = await fetch(`/api/expenses?userId=${user?.id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch expenses");
    }
    return response.json();
  };

  return useQuery<Expenses[], PostgrestError>({
    queryFn: getExpenses,
    queryKey: ["getExpenses", user?.id],
    enabled: !!user?.id,
  });
};

const useEditExpense = (id: string) => {
  const supabase = createClient();

  const { user } = useAuth();

  const queryClient = useQueryClient();

  const editExpense = async (data: z.infer<typeof createExpenseSchema>) => {
    let fileUrl = null;

    if (data.file) {
      const { data: fileData, error } = await supabase.storage
        .from("documents")
        .upload(
          `${user?.id}/expenses/${Date.now()}-${data.file.name}`,
          data.file
        );

      if (error) throw error;
      fileUrl = fileData.path;
    }

    const response = await fetch(`/api/expenses?userId=${user?.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...data }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to edit expense");
    }

    return response.json();
  };

  return useMutation<
    Expenses,
    PostgrestError,
    z.infer<typeof createExpenseSchema>
  >({
    mutationFn: (data) => editExpense(data),
    mutationKey: ["edit-expense", id],
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["getExpenses", user?.id],
      });
    },
  });
};

const useGetExpense = (id: string) => {
  const supabase = createClient();

  const getExpense = async () => {
    const { data, error } = await supabase
      .from("expenses")
      .select()
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  };

  return useQuery<Expenses, PostgrestError>({
    queryFn: getExpense,
    queryKey: ["getExpense", id],
    enabled: !!id,
  });
};

const useDeleteExpense = () => {
  const supabase = createClient();

  const { user } = useAuth();

  const queryClient = useQueryClient();

  const deleteExpense = async (id: string) => {
    const response = await fetch(`/api/expenses?userId=${user?.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete expense");
    }

    return response.json();
  };

  return useMutation<void, PostgrestError, { id: string }>({
    mutationFn: (data) => deleteExpense(data.id),
    mutationKey: ["delete-expense", user?.id],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getExpenses", user?.id],
      });
    },
  });
};

export {
  useGetExpenses,
  useCreateExpense,
  useGetExpense,
  useEditExpense,
  useDeleteExpense,
};
