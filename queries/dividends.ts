// @ts-nocheck

import { createDividendSchema } from "@/lib/schema";
import { Dividends } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";

// const useCreateDividend = (company_id: string) => {
//   const supabase = createClient();
//   const queryClient = useQueryClient();

//   const createDividend = async (data: z.infer<typeof createDividendSchema>) => {
//     let fileUrl = null;

//     if (data.file) {
//       const { data: fileData, error } = await supabase.storage
//         .from("documents")
//         .upload(
//           `${company_id}/dividends/${Date.now()}-${data.file.name}`,
//           data.file
//         );

//       if (error) throw error;
//       fileUrl = fileData.path;
//     }

//     const { data: dividend, error } = await supabase.from("dividends").insert({
//       company_id,
//       date: data.date?.toISOString(),
//       amount: parseFloat(data.amount),
//       member_name: data.member_name,
//       file_url: fileUrl,
//     });

//     if (error) {
//       throw error;
//     }

//     return dividend;
//   };

//   return useMutation<
//     Dividends,
//     PostgrestError,
//     z.infer<typeof createDividendSchema>
//   >({
//     mutationFn: (data) => createDividend(data),
//     mutationKey: ["create-dividend", company_id],
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["getDividends", company_id],
//       });
//     },
//   });
// };

const useCreateDividend = (company_id: string) => {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const createDividend = async (data: z.infer<typeof createDividendSchema>) => {
    let fileUrl = null;

    // Handle file upload first using client-side Supabase
    if (data.file) {
      const { data: fileData, error: uploadError } = await supabase.storage
        .from("documents")
        .upload(
          `${company_id}/dividends/${Date.now()}-${data.file.name}`,
          data.file
        );

      if (uploadError) {
        throw new Error("File upload failed: " + uploadError.message);
      }
      fileUrl = fileData.path;
    }

    const response = await fetch("/api/dividends", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_id,
        date: data.date?.toISOString() || "",
        amount: data.amount,
        member_name: data.member_name,
        file_url: fileUrl,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create dividend");
    }

    return response.json();
  };

  return useMutation<Dividends, Error, z.infer<typeof createDividendSchema>>({
    mutationFn: createDividend,
    mutationKey: ["create-dividend", company_id],
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["getDividends", company_id],
      });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });
};

const useGetDividends = () => {
  const supabase = createClient();
  const { user } = useAuth();
  // const getDividends = async () => {
  //   const { data, error } = await supabase
  //     .from("dividends")
  //     .select()
  //     .eq("company_id", user?.id!);

  //   if (error) {
  //     throw error;
  //   }

  //   return data;
  // };
  const getDividends = async () => {
    const response = await fetch(`/api/dividends?userId=${user?.id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch dividends");
    }
    return response.json();
  };

  return useQuery<Dividends[], PostgrestError>({
    queryFn: getDividends,
    queryKey: ["getDividends", user?.id],
    enabled: !!user?.id,
  });
};

const useEditDividend = (id: string) => {
  const supabase = createClient();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const editDividend = async (data: z.infer<typeof createDividendSchema>) => {
    let fileUrl = null;

    if (data.file) {
      const { data: fileData, error } = await supabase.storage
        .from("documents")
        .upload(
          `${user?.id}/dividends/${Date.now()}-${data.file.name}`,
          data.file
        );

      if (error) throw error;
      fileUrl = fileData.path;
    }

    const response = await fetch(`/api/dividends?userId=${user?.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        date: data.date?.toISOString(),
        amount: parseFloat(data.amount),
        member_name: data.member_name,
        ...(fileUrl ? { file_url: fileUrl } : {}),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to edit dividend");
    }

    return response.json();
  };

  return useMutation<
    Dividends,
    PostgrestError,
    z.infer<typeof createDividendSchema>
  >({
    mutationFn: (data) => editDividend(data),
    mutationKey: ["edit-dividend", id],
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["getDividends", user?.id] });
    },
  });
};

const useGetDividend = (id: string) => {
  const supabase = createClient();

  const getDividend = async () => {
    const { data, error } = await supabase
      .from("dividends")
      .select()
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  };

  return useQuery<Dividends, PostgrestError>({
    queryFn: getDividend,
    queryKey: ["getDividend", id],
    enabled: !!id,
  });
};

const useDeleteDividend = () => {
  const supabase = createClient();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const deleteDividend = async (id: string) => {
    const { error } = await supabase.from("dividends").delete().eq("id", id);

    if (error) {
      throw error;
    }
  };

  return useMutation<void, PostgrestError, { id: string }>({
    mutationFn: (data) => deleteDividend(data.id),
    mutationKey: ["delete-dividend", user?.id],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getDividends", user?.id],
      });
    },
  });
};

export {
  useGetDividends,
  useCreateDividend,
  useGetDividend,
  useEditDividend,
  useDeleteDividend,
};
