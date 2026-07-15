"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "sonner";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        {children}
        <Toaster position="bottom-right" richColors />
      </AuthProvider>
    </ThemeProvider>
  );
}
