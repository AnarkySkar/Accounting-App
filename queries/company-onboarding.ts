import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { createLLCSchema } from "@/lib/schema";
import { PostgrestError } from "@supabase/supabase-js";
import { useAuth } from "@/context/AuthContext";

// ✅ 3. Hook for fetching a single LLC by ID
export const useGetLLC = () => {
  const { user } = useAuth();

  const getLLC = async () => {
    const response = await fetch(`/api/company-onboarding?userId=${user?.id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch LLC data");
    }
    return response.json();
  };

  return useQuery<any, Error>({
    queryFn: getLLC,
    queryKey: ["getLLC", user?.id],
    enabled: !!user?.id,
  });
};

// ✅ 4. Hook for editing LLC details
export const useEditLLC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const supabase = createClient();

  const editLLC = async (data: z.infer<typeof createLLCSchema>) => {
    // Handle file upload first if there's a file
    let fileUrl = null;
    if (data.llc_documents) {
      const { data: fileData, error } = await supabase.storage
        .from("documents")
        .upload(
          `llc-documents/${Date.now()}-${data.llc_documents.name}`,
          data.llc_documents
        );

      if (error) throw error;
      fileUrl = fileData.path;
    }

    // Then send the data to the API
    const response = await fetch(`/api/company-onboarding?userId=${user?.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        llc_name: data.llc_name,
        business_description: data.business_description,
        llc_type: data.llc_type,
        owner_residence: data.owner_residence,
        owner_citizenship: data.owner_citizenship,
        llc_ein: data.llc_ein,
        llc_address: data.llc_address,
        state_incorporation: data.state_incorporation,
        date_incorporation: data.date_incorporation?.toISOString(),
        llc_members: data.llc_members,
        ...(fileUrl ? { llc_documents: fileUrl } : {}),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update LLC");
    }

    return response.json();
  };

  return useMutation<any, Error, z.infer<typeof createLLCSchema>>({
    mutationFn: editLLC,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getLLC", user?.id],
      });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });
};
