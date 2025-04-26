import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Company, SignInFormData, SignUpFormData } from "@/types";
import { createClient } from "@/utils/supabase/client";
import {
  PostgrestError,
  Session,
  User,
  WeakPassword,
} from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const useGetCompany = () => {
  const { user } = useAuth();

  const getCompany = async () => {
    const response = await fetch(`/api/company?userId=${user?.id}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch company data");
    }
    return response.json();
  };

  return useQuery<Company>({
    queryKey: ["get-company", user?.id],
    queryFn: getCompany,
    enabled: !!user?.id,
  });
};

// const useSignIn = () => {
//   const queryClient = useQueryClient();
//   const { toast } = useToast();
//   const router = useRouter();

//   const signIn = async (data: SignInFormData) => {
//     const response = await fetch("/api/auth/sign-in", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || "Failed to sign in");
//     }

//     return response.json();
//   };

//   return useMutation<
//     { user: User; session: Session; weakPassword?: WeakPassword },
//     Error,
//     SignInFormData
//   >({
//     mutationFn: signIn,
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({
//         queryKey: ["get-company", data?.user?.id],
//       });
//       router.push("/dashboard");
//     },
//     onError: (error) => {
//       toast({
//         title: "Error",
//         description: error.message || "An error occurred while signing in",
//         variant: "destructive",
//       });
//     },
//   });
// };

const useSignIn = () => {
  const supabase = createClient();

  const queryClient = useQueryClient();

  const { toast } = useToast();

  const router = useRouter();

  const signIn = async (data: SignInFormData) => {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      throw error;
    }

    return authData;
  };

  return useMutation<
    { user: User; session: Session; weakPassword?: WeakPassword },
    PostgrestError,
    SignInFormData
  >({
    mutationKey: ["sign-in"],
    mutationFn: signIn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["get-company", data?.user?.id],
      });
      router.push("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error?.message || "An error occurred while signing in",
        variant: "destructive",
      });
    },
  });
};

// const useSignUp = () => {
//   const queryClient = useQueryClient();
//   const { toast } = useToast();
//   const router = useRouter();

//   const signUp = async (data: SignUpFormData) => {
//     const response = await fetch("/api/auth/sign-up", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || "Failed to sign up");
//     }

//     return response.json();
//   };

//   return useMutation<
//     { user: User | null; session: Session | null },
//     Error,
//     SignUpFormData
//   >({
//     mutationFn: signUp,
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({
//         queryKey: ["get-company", data?.user?.id],
//       });
//       router.push("/protected/onboarding");
//     },
//     onError: (error) => {
//       toast({
//         title: "Error",
//         description: error.message || "An error occurred while signing up",
//         variant: "destructive",
//       });
//     },
//   });
// };

const useSignUp = () => {
  const supabase = createClient();

  const queryClient = useQueryClient();

  const { toast } = useToast();

  const router = useRouter();

  const signUp = async (data: SignUpFormData) => {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          address: data.address,
        },
      },
    });

    if (error) {
      throw error;
    }

    return authData;
  };

  return useMutation<
    { user: User | null; session: Session | null },
    PostgrestError,
    SignUpFormData
  >({
    mutationKey: ["sign-in"],
    mutationFn: signUp,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["get-company", data?.user?.id],
      });
      router.push("/protected/onboarding");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error?.message || "An error occurred while signing up",
        variant: "destructive",
      });
    },
  });
};

// const useSignOut = () => {
//   const queryClient = useQueryClient();
//   const { toast } = useToast();
//   const router = useRouter();

//   const signOut = async () => {
//     const response = await fetch("/api/auth/sign-out", {
//       method: "POST",
//       credentials: "include", // Important for cookie handling
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || "Failed to sign out");
//     }

//     return response.json();
//   };

//   return useMutation<void, Error>({
//     mutationFn: signOut,
//     onSuccess: () => {
//       console.log("Sign out successful, redirecting to /sign-in");
//       queryClient.clear();
//       router.replace("/sign-in");
//     },
//     onError: (error) => {
//       console.error("Sign out error:", error);
//       toast({
//         title: "Error",
//         description: error.message || "An error occurred while signing out",
//         variant: "destructive",
//       });
//     },
//   });
// };

const useSignOut = () => {
  const supabase = createClient();

  const queryClient = useQueryClient();

  const { toast } = useToast();

  const router = useRouter();

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  };

  return useMutation<void, PostgrestError>({
    mutationKey: ["sign-out"],
    mutationFn: signOut,
    onSuccess: () => {
      window.location.href = "/sign-in";

      queryClient.clear();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error?.message || "An error occurred while signing out",
        variant: "destructive",
      });
    },
  });
};

export { useSignIn, useGetCompany, useSignOut, useSignUp };
