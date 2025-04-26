// @ts-nocheck

import { createRevenueSchema } from "@/lib/schema";
import { Revenue } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";

// const useCreateRevenue = (company_id: string) => {
//   const supabase = createClient();
//   const queryClient = useQueryClient();

//   const createRevenue = async (data: z.infer<typeof createRevenueSchema>) => {
//     let fileUrl = null;

//     if (data.file) {
//       const { data: fileData, error } = await supabase.storage
//         .from("documents")
//         .upload(
//           `${company_id}/revenue/${Date.now()}-${data.file.name}`,
//           data.file
//         );

//       if (error) throw error;
//       fileUrl = fileData.path;
//     }

//     const { data: revenue, error } = await supabase.from("revenue").insert({
//       company_id,
//       date: data.date?.toISOString(),
//       business_income: parseFloat(data.businessIncome),
//       personal_income: parseFloat(data.personalIncome),
//       file_url: fileUrl,
//     });

//     if (error) {
//       throw error;
//     }

//     return revenue;
//   };

//   return useMutation<
//     Revenue,
//     PostgrestError,
//     z.infer<typeof createRevenueSchema>
//   >({
//     mutationFn: (data) => createRevenue(data),
//     mutationKey: ["create-revenue", company_id],
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["getRevenue", company_id],
//       });
//     },
//   });
// };

const useCreateRevenue = (company_id: string) => {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const createRevenue = async (data: z.infer<typeof createRevenueSchema>) => {
    let fileUrl = null;

    // Handle file upload first using client-side Supabase
    if (data.file) {
      const { data: fileData, error: uploadError } = await supabase.storage
        .from("documents")
        .upload(
          `${company_id}/revenue/${Date.now()}-${data.file.name}`,
          data.file
        );

      if (uploadError) {
        throw new Error("File upload failed: " + uploadError.message);
      }
      fileUrl = fileData.path;
    }

    const response = await fetch("/api/revenue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_id,
        date: data.date?.toISOString() || "",
        businessIncome: data.businessIncome.toString(),
        personalIncome: data.personalIncome.toString(),
        file_url: fileUrl,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create revenue");
    }

    return response.json();
  };

  return useMutation<Revenue, Error, z.infer<typeof createRevenueSchema>>({
    mutationFn: createRevenue,
    mutationKey: ["create-revenue", company_id],
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["getRevenue", company_id],
      });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });
};
const useGetRevenue = () => {
  const supabase = createClient();
  const { user } = useAuth();

  // const getRevenue = async () => {
  //   const { data, error } = await supabase
  //     .from("revenue")
  //     .select()
  //     .eq("company_id", user?.id!);

  //   if (error) {
  //     throw error;
  //   }

  //   return data;
  // };

  const getRevenue = async () => {
    const response = await fetch(`/api/revenue?userId=${user?.id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch revenue");
    }
    return response.json();
  };

  return useQuery<Revenue[], PostgrestError>({
    queryFn: getRevenue,
    queryKey: ["getRevenue", user?.id],
  });
};

const useEditRevenue = (id: string) => {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const { user } = useAuth();
  const editRevenue = async (data: z.infer<typeof createRevenueSchema>) => {
    let fileUrl = null;

    if (data.file) {
      // Create a FormData object for the file upload
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("company_id", company_id);
      formData.append("folder", "revenue");

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

    const payload = {
      id,
      business_income: parseFloat(data.business_income),
      personal_income: parseFloat(data.personal_income),
      date: data.date?.toISOString(),
      file_url: fileUrl,
    };

    const response = await fetch(`/api/revenue?id=${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update revenue");
    }

    return response.json();
  };

  return useMutation({
    mutationFn: editRevenue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getRevenue", user?.id] });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });
};

const useGetSingleRevenue = (id: string) => {
  const supabase = createClient();

  const getSingleRevenue = async () => {
    const { data, error } = await supabase
      .from("revenue")
      .select()
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  };

  return useQuery<Revenue, PostgrestError>({
    queryFn: getSingleRevenue,
    queryKey: ["getSingleRevenue", id],

    enabled: !!id,
  });
};

const useDeleteRevenue = () => {
  const supabase = createClient();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const deleteRevenue = async (id: string) => {
    const { error } = await supabase.from("revenue").delete().eq("id", id);

    if (error) {
      throw error;
    }
  };

  return useMutation<void, PostgrestError, { id: string }>({
    mutationFn: (data) => deleteRevenue(data.id),
    mutationKey: ["delete-revenue", user?.id],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getRevenue", user?.id] });
    },
  });
};

export {
  useGetRevenue,
  useCreateRevenue,
  useGetSingleRevenue,
  useEditRevenue,
  useDeleteRevenue,
};
