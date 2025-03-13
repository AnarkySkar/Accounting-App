import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import QueryProvider from "@/components/QueryProvider";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import I18nProvider from "@/components/I18nProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { CurrencyProvider } from "@/context/CurrencyContext";
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Accounting App",
  description: "A simple accounting app",
};

const geistSans = Inter({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            {" "}
            {/* Wrap everything inside I18nProvider */}
            <AuthProvider>
              <QueryProvider>
                <CurrencyProvider>
                  <main className="min-h-screen w-full">{children}</main>
                </CurrencyProvider>
              </QueryProvider>
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
