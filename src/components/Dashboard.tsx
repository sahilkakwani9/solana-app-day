import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UnlockIcon,
  WalletIcon,
  SendIcon,
  ExternalLink,
  PlusCircleIcon,
} from "lucide-react";
import useVaultBalance from "@/hooks/useVaultBalance";
import { useWallet } from "@/hooks/useWalletProvider";
import { useAnchor } from "@/hooks/useAnchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "./providers";

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { publicKey, sendTransaction, connect } = useWallet();
  const { program } = useAnchor();
  const { connection } = useConnection();
  const { vaultBalance, isLoading } = useVaultBalance();
  const { toast } = useToast();
  const [pubKey, setPubKey] = useState("");
  const [amount, setAmount] = useState("");

  function getVaultAddress() {
    console.log("PD", program?.programId.toString());

    if (!program) return new PublicKey("");
    const pdaAddress = PublicKey.findProgramAddressSync(
      [Buffer.from("vault")],
      program.programId
    )[0];
    return pdaAddress;
  }

  function getProposalCounterAddress() {
    if (!program) return new PublicKey("");
    const pdaAddress = PublicKey.findProgramAddressSync(
      [Buffer.from("contest_counter")],
      program.programId
    )[0];
    return pdaAddress;
  }

  const handleInitVault = async () => {
    if (!program || !publicKey) return;
    try {
      const va = getVaultAddress();

      const txn = await program.methods
        .initialize()
        .accounts({
          vault: va,
          owner: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .transaction();

      txn.feePayer = publicKey;
      txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      const hash = await sendTransaction(txn);

      if (hash && hash.signature) {
        toast({
          title: "Vault Initialized",
          action: (
            <Button
              variant="link"
              className="text-[#98FB98] hover:text-[#98FB98]/80 h-auto p-0"
              onClick={() =>
                window.open(
                  `https://eclipsescan.xyz/tx/${hash.signature}?cluster=devnet`,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              <span className="flex items-center gap-1">
                View transaction
                <ExternalLink className="h-4 w-4" />
              </span>
            </Button>
          ),
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error initializing vault",
        variant: "destructive",
      });
    }
  };

  const handleInitCounter = async () => {
    if (!program || !publicKey) return;
    try {
      // Add your counter initialization logic here
      const txn = await program.methods
        .initContestCounter()
        .accounts({
          owner: publicKey,
          contestCounter: getProposalCounterAddress(),
          systemProgram: SystemProgram.programId,
        })
        .transaction();
      txn.feePayer = publicKey;
      txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      const hash = await sendTransaction(txn);

      if (hash && hash.signature) {
        toast({
          title: "Contest Counter Initialized",
          action: (
            <Button
              variant="link"
              className="text-[#98FB98] hover:text-[#98FB98]/80 h-auto p-0"
              onClick={() =>
                window.open(
                  `https://eclipsescan.xyz/tx/${hash.signature}?cluster=devnet`,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              <span className="flex items-center gap-1">
                View transaction
                <ExternalLink className="h-4 w-4" />
              </span>
            </Button>
          ),
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error initializing counter",
        variant: "destructive",
      });
    }
  };

  const handleInitContest = async () => {
    if (!program || !publicKey) return;
    try {
      const proposalPDA = PublicKey.findProgramAddressSync(
        [
          Buffer.from("contest"),
          publicKey.toBuffer(),
          new BN(0).toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      )[0];
      // Setting base date to Nov 15, 2024 at 10:00 AM Bangkok time (GMT+7)
      const startDate = new Date("2024-11-15T03:00:00Z"); // 10:00 AM Bangkok time in UTC
      const startTime = new BN(Math.floor(startDate.getTime() / 1000));

      // Setting end date to Nov 15, 2024 at 4:00 PM Bangkok time (GMT+7)
      const endDate = new Date("2024-11-15T09:00:00Z"); // 4:00 PM Bangkok time in UTC
      const endTime = new BN(Math.floor(endDate.getTime() / 1000));

      const txn = await program.methods
        .createContest(
          "https://nks4x6tif7cok23wbxmidken5gxnirzz4fp7qv2jalidcicstz4a.arweave.net/aqXL-mgvxOVrdg3YgaiN6a7URznhX_hXSQLQMSBSnng",
          startTime,
          endTime
        )
        .accounts({
          contest: proposalPDA,
          author: publicKey,
          systemProgram: SystemProgram.programId,
          contestCounter: getProposalCounterAddress(),
        })
        .transaction();
      txn.feePayer = publicKey;
      txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      const hash = await sendTransaction(txn);

      if (hash && hash.signature) {
        toast({
          title: "Contest Initialized",
          action: (
            <Button
              variant="link"
              className="text-[#98FB98] hover:text-[#98FB98]/80 h-auto p-0"
              onClick={() =>
                window.open(
                  `https://eclipsescan.xyz/tx/${hash.signature}?cluster=devnet`,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              <span className="flex items-center gap-1">
                View transaction
                <ExternalLink className="h-4 w-4" />
              </span>
            </Button>
          ),
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error initializing contest",
        variant: "destructive",
      });
    }
  };

  const handleDistribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!program) return;

    try {
      if (!publicKey) return;
      const vaultPubkey = getVaultAddress();
      const txn = await program.methods
        .distribute(new BN(parseFloat(amount) * LAMPORTS_PER_SOL))
        .accounts({
          vault: vaultPubkey,
          authority: publicKey!,
          recipient: pubKey,
          systemProgram: SystemProgram.programId,
        })
        .transaction();
      txn.feePayer = publicKey!;
      txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      const hash = await sendTransaction(txn);
      if (hash && hash.signature) {
        toast({
          title: "Funds Sent.",
          action: (
            <Button
              variant="link"
              className="text-[#98FB98] hover:text-[#98FB98]/80 h-auto p-0"
              onClick={() =>
                window.open(
                  `https://eclipsescan.xyz/tx/${hash.signature}?cluster=devnet`,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              <span className="flex items-center gap-1">
                View transaction
                <ExternalLink className="h-4 w-4" />
              </span>
            </Button>
          ),
        });
      }
      await queryClient.invalidateQueries({
        queryKey: ["VaultBalance"],
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-[#4ADE80] text-2xl font-bold">Vault Dashboard</h1>
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-[#4ADE80] text-[#4ADE80] hover:bg-[#4ADE80] hover:text-black"
          >
            <UnlockIcon className="w-4 h-4 mr-2" />
            Lock Vault
          </Button>
        </div>
        <Card className="border-[#4ADE80] bg-black text-[#4ADE80]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WalletIcon className="w-5 h-5" />
              Current Balance :
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{vaultBalance ?? 0} ETH</p>
          </CardContent>
        </Card>

        <Card className="border-[#4ADE80] bg-black text-[#4ADE80]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircleIcon className="w-5 h-5" />
              Initialize Components
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <Button
                onClick={handleInitVault}
                className="bg-[#4ADE80] text-black hover:bg-[#4ADE80]/90 w-full"
              >
                Init Vault
              </Button>
              <Button
                onClick={handleInitCounter}
                className="bg-[#4ADE80] text-black hover:bg-[#4ADE80]/90 w-full"
              >
                Init Counter
              </Button>
              <Button
                onClick={handleInitContest}
                className="bg-[#4ADE80] text-black hover:bg-[#4ADE80]/90 w-full"
              >
                Init Contest
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#4ADE80] bg-black text-[#4ADE80]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SendIcon className="w-5 h-5" />
              Distribute Funds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDistribute} className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Recipient Public Key"
                  value={pubKey}
                  onChange={(e) => setPubKey(e.target.value)}
                  className="border-[#4ADE80] bg-black text-[#4ADE80] placeholder:text-[#4ADE80]/50"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="number"
                  step="0.000001"
                  placeholder="Amount (SOL)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border-[#4ADE80] bg-black text-[#4ADE80] placeholder:text-[#4ADE80]/50"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#4ADE80] text-black hover:bg-[#4ADE80]/90"
              >
                Send Funds
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
