"use client";

import AppWalletProvider from "@/hooks/useWalletProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { AnchorProvider } from "@/hooks/useAnchor";

export const queryClient = new QueryClient();

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <WalletProvider wallets={[]}> */}
      <AppWalletProvider>
        <AnchorProvider>
          <ThemeProvider attribute="class" defaultTheme="dark">
            {children}
          </ThemeProvider>
        </AnchorProvider>
      </AppWalletProvider>
      {/* </WalletProvider> */}

      <Toaster />
    </QueryClientProvider>
  );
}

export default Providers;
