"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Program, AnchorProvider as AP, Idl } from "@project-serum/anchor";
import { IDL } from "@/data/idl";
import { useConnection } from "@solana/wallet-adapter-react";
import { PROGRAM_ID } from "@/lib/constant";
import { useWallet } from "./useWalletProvider";

interface AnchorContextType {
  program: Program | null;
  error: Error | null;
}

const AnchorContext = createContext<AnchorContextType>({
  program: null,
  error: null,
});

export function AnchorProvider({ children }: { children: React.ReactNode }) {
  const [program, setProgram] = useState<Program | null>(null);
  const { connection } = useConnection();
  const [error, setError] = useState<Error | null>(null);
  // const { publicKey, signTransaction } = useWallet();
  const { publicKey, signTransaction } = useWallet();

  useEffect(() => {
    try {
      if (!publicKey) return;

      if (typeof window !== undefined) {
        console.log(typeof window);
        const anchorProvider = new AP(
          connection,
          {
            publicKey: publicKey,
            signTransaction: (t) => signTransaction(t),
            signAllTransactions: (t) => {
              return Promise.all(t.map((i) => signTransaction(i)));
            },
          },
          AP.defaultOptions()
        );

        try {
          const initProgram = new Program(
            IDL as Idl,
            PROGRAM_ID,
            anchorProvider
          );

          setProgram(initProgram);
        } catch (error) {
          console.log("error is here", error);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to initialize program")
      );
      console.log("error", err);
    }
  }, [publicKey]);

  return (
    <AnchorContext.Provider value={{ program, error }}>
      {children}
    </AnchorContext.Provider>
  );
}

export function useAnchor() {
  const context = useContext(AnchorContext);
  if (context === undefined) {
    throw new Error("useAnchor must be used within an AnchorProvider");
  }
  return context;
}
