import { createAssetsSchema } from "@/lib/schema";
import { Assets } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";

const supabase = createClient();

const useCreateAsset = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const createAsset = async (data: z.infer<typeof createAssetsSchema>) => {
    let fileUrl = null;

    if (data.file) {
      const { data: fileData, error } = await supabase.storage
        .from("documents")
        .upload(
          `${user?.id}/assets/${Date.now()}-${data.file.name}`,
          data.file
        );

      if (error) throw error;
      fileUrl = fileData.path;
    }

    const { data: asset, error } = await supabase
      .from("assets")
      .insert({
        company_id: user?.id,
        title: data.title,
        assets_date: data.date?.toISOString(),
        digital_assets: parseFloat(data.digital_assets),
        liquid_assets: parseFloat(data.liquid_assets),
        physical_assets: parseFloat(data.physical_assets),
        file_url: fileUrl,
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return asset as Assets;
  };

  return useMutation<
    Assets,
    PostgrestError,
    z.infer<typeof createAssetsSchema>
  >({
    mutationFn: (data) => createAsset(data),
    mutationKey: ["create-asset", user?.id],
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["getAssets", user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["getAssets", user?.id],
      });
    },
  });
};

const useGetAssets = () => {
  const { user, isLoading: isAuthLoading } = useAuth();

  console.log("useGetAssets hook called", { user, isAuthLoading });

  const getAssets = async () => {
    console.log("getAssets function executing", { userId: user?.id });

    if (!user?.id) {
      console.error("No user ID available");
      return [];
    }

    try {
      const { data, error } = await supabase
        .from("assets")
        .select()
        .eq("company_id", user.id);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Assets data fetched:", data);
      return data;
    } catch (err) {
      console.error("Error in getAssets:", err);
      throw err;
    }
  };

  return useQuery({
    queryKey: ["getAssets", user?.id],
    queryFn: getAssets,
    enabled: !!user?.id && !isAuthLoading,
  });
};

const useGetAsset = (id: string) => {
  const getAsset = async () => {
    const { data, error } = await supabase
      .from("assets")
      .select()
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  };

  return useQuery<Assets, PostgrestError>({
    queryFn: getAsset,
    queryKey: ["getAsset", id],
    enabled: !!id,
  });
};

const useDeleteAsset = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const deleteAsset = async (id: string) => {
    const { error } = await supabase.from("assets").delete().eq("id", id);

    if (error) {
      throw error;
    }
  };

  return useMutation<void, PostgrestError, { id: string }>({
    mutationFn: (data) => deleteAsset(data.id),
    mutationKey: ["delete-asset", user?.id],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getAssets", user?.id],
      });
      queryClient.refetchQueries({
        queryKey: ["getAssets", user?.id],
      });
    },
  });
};

const useEditAsset = (id: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const editAsset = async (data: z.infer<typeof createAssetsSchema>) => {
    let fileUrl = null;

    if (data.file) {
      const { data: fileData, error } = await supabase.storage
        .from("documents")
        .upload(
          `${user?.id}/assets/${Date.now()}-${data.file.name}`,
          data.file
        );

      if (error) throw error;
      fileUrl = fileData.path;
    }

    const { data: asset, error } = await supabase
      .from("assets")
      .update({
        title: data.title,
        assets_date: data.date?.toISOString(),
        digital_assets: parseFloat(data.digital_assets),
        liquid_assets: parseFloat(data.liquid_assets),
        physical_assets: parseFloat(data.physical_assets),
        file_url: fileUrl || undefined,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return asset as Assets;
  };

  return useMutation<
    Assets,
    PostgrestError,
    z.infer<typeof createAssetsSchema>
  >({
    mutationFn: (data) => editAsset(data),
    mutationKey: ["edit-asset", id],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAssets", user?.id] });
      queryClient.refetchQueries({ queryKey: ["getAssets", user?.id] });
    },
  });
};

export {
  useGetAssets,
  useCreateAsset,
  useGetAsset,
  useDeleteAsset,
  useEditAsset,
};
