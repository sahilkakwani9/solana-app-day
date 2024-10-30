"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import {
  clusterApiUrl,
  PublicKey,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import { useToast } from "./use-toast";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EclipseRPC } from "@/lib/constant";

// Define the context type
interface WalletContextType {
  isConnected: boolean;
  setIsConnected: (value: boolean) => void;
  publicKey: PublicKey | null;
  setPublicKey: (key: PublicKey | null) => void;
  signTransaction<T extends Transaction | VersionedTransaction>(
    tx: T
  ): Promise<T>;
  sendTransaction: (txn: Transaction) => Promise<{
    signature: string;
  }>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

// Create the context
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Create a custom hook to use the wallet context
export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

export default function AppWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const endpoint = EclipseRPC;
  const { toast } = useToast();

  const connect = async () => {
    try {
      if (typeof window != undefined) {
        if (!window?.backpack) {
          toast({
            variant: "default",
            title: "Wallet Required",
            description:
              "Backpack wallet is required to interact with this application",
            action: (
              <Button
                variant="outline"
                size="sm"
                className="border-[#98FB98] text-[#98FB98] hover:bg-[#98FB98] hover:text-black"
                onClick={() =>
                  window.open(
                    "https://www.backpack.app/",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                <span className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Install Backpack
                </span>
              </Button>
            ),
          });
          return;
        }
        await window?.backpack?.connect();
        setIsConnected(true);
        setPublicKey(window?.backpack?.publicKey);
      }
    } catch (error) {
      console.log("error connecting wallet", error);
    }
  };

  const disconnect = async () => {
    try {
      if (typeof window != undefined) {
        await window?.backpack?.disconnect();
        setPublicKey(null);
        setIsConnected(false);
      }
    } catch (error) {
      console.log("error disconnecting wallet", error);
    }
  };

  const signTransaction = async (t: VersionedTransaction | Transaction) => {
    try {
      return await window?.backpack?.signTransaction(t);
    } catch (error) {
      console.log("error signing transaction", error);
    }
  };

  const sendTransaction = async (txn: Transaction) => {
    try {
      return await window?.backpack?.sendAndConfirm(txn);
    } catch (error) {
      console.log("error sendingtransaction", error);
    }
  };

  useEffect(() => {
    if (typeof window != undefined) {
      if (window?.backpack?.isConnected) {
        setIsConnected(true);
        setPublicKey(window?.backpack?.publicKey);
      }
      window?.backpack?.on("connect", (data: { publicKey: string }) => {
        const publicKey = new PublicKey(data.publicKey);
        setPublicKey(publicKey);
        setIsConnected(true);
      });
    }
  }, []);

  const value = useMemo(
    () => ({
      isConnected,
      setIsConnected,
      publicKey,
      setPublicKey,
      connect,
      disconnect,
      signTransaction,
      sendTransaction,
    }),
    [isConnected, publicKey]
  );

  return (
    <WalletContext.Provider value={value}>
      <ConnectionProvider endpoint={endpoint}>{children}</ConnectionProvider>
    </WalletContext.Provider>
  );
}
