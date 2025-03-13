"use client";

// context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { Company } from "@/types";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  company: Company | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check session on initial load
    const checkUserSession = async () => {
      try {
        setIsLoading(true);
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          return;
        }

        if (session?.user) {
          setUser(session.user);
          setSession(session);
          setIsAuthenticated(true);
          await fetchCompanyData(session.user.id);
        } else {
          setUser(null);
          setCompany(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Unexpected error checking session:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);

        if (session?.user) {
          setUser(session.user);
          setSession(session);
          setIsAuthenticated(true);
          await fetchCompanyData(session.user.id);
        } else {
          setUser(null);
          setCompany(null);
          setSession(null);
          setIsAuthenticated(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchCompanyData = async (userId: string) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching company data:", error);
        setCompany(null);
        return;
      }

      setCompany(data);
    } catch (err) {
      console.error("Unexpected error fetching company data:", err);
      setCompany(null);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    company,
    isLoading,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for accessing AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
