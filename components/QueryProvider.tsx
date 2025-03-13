"use client";

import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from "@tanstack/react-query";
import { useTheme } from "next-themes";
import NextTopLoader from "nextjs-toploader";

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  // const { theme } = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      {/* <NextTopLoader
        color={theme === "dark" || theme === "system" ? "#ffffff" : "#080808"}
      /> */}
      {children}
    </QueryClientProvider>
  );
};

export default QueryProvider;
