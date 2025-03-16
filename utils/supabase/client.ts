import { unstable_noStore as noStore } from "next/cache";
import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  noStore();
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: (url: any, options = {}) => {
          return fetch(url, { ...options, cache: "no-store" });
        },
      },
    }
  );
};
