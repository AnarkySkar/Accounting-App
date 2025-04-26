import { createClient } from "@/utils/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { createLLCSchema } from "@/lib/schema";
import { PostgrestError } from "@supabase/supabase-js";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

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
  const { data: llcData } = useGetLLC(); // Fetch LLC Data
  const { user } = useAuth();
  const supabase = createClient();

  const editLLC = async (data: z.infer<typeof createLLCSchema>) => {
    // Handle file upload first if there's a file

    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to edit LLC details",
        variant: "destructive",
      });
      return;
    }

    const fileUrls = llcData?.llc_documents ?? [];

    if (data.llc_documents) {
      for (let document of data.llc_documents) {
        const file = document;
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `${user.id}/documents/${fileName}`;

        const { data: uploadedFile, error } = await supabase.storage
          .from("documents")
          .upload(filePath, file);

        if (error) throw error;

        fileUrls.push({ id: uploadedFile.id, name: fileName });
      }
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
        llc_documents: fileUrls,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      // throw new Error(error.message || "Failed to update LLC");
      return;
    }

    return await response.json();
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

export const useDeleteLLCDocument = () => {
  const { user } = useAuth();
  const { data: llcData } = useGetLLC(); // Fetch LLC Data

  const mutationFn = async (fileName: string) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to edit LLC details",
        variant: "destructive",
      });
      return;
    }

    const response = await fetch(`/api/company-onboarding?userId=${user?.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...llcData,
        llc_documents: llcData.llc_documents.filter(
          (doc: any) => doc.name !== fileName
        ),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update LLC");
    }

    return await response.json();
  };

  return useMutation({
    mutationFn,
  });
};
