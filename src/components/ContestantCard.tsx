import { useAnchor } from "@/hooks/useAnchor";
import { useWallet } from "@/hooks/useWalletProvider";
import { CONTEST_ADDRESS } from "@/lib/constant";
import { BN } from "@project-serum/anchor";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { ExternalLink, Globe, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useConnection } from "@solana/wallet-adapter-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { truncateDescription } from "@/lib/utils";
import { queryClient } from "./providers";
import { useEthereumPrice } from "@/hooks/useEthPrice";
import GoogleDriveImage from "./GoogleDriveImage";
import { LinkedInLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";

const MotionCard = motion(Card);

function ContestantCard({ contestant }: { contestant: Contestant }) {
  const { publicKey, sendTransaction, connect } = useWallet();
  const { program } = useAnchor();
  const { connection } = useConnection();
  const { toast } = useToast();
  const { data: ethPrice } = useEthereumPrice();
  const [isLoading, setIsLoading] = useState(false);

  const getLinkIcon = (link: string) => {
    if (/twitter\.com|x\.com/i.test(link)) {
      return <TwitterLogoIcon className="h-6 w-6 text-[#98FB98]" />;
    } else if (/linkedin\.com/i.test(link)) {
      return <LinkedInLogoIcon className="h-6 w-6 text-[#98FB98]" />;
    } else {
      return <Globe className="h-6 w-6 text-[#98FB98]" />;
    }
  };

  function ensureHttps(url: string): string {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `https://${url}`;
  }

  function getVaultAddress() {
    if (!program) return new PublicKey("");
    const pdaAddress = PublicKey.findProgramAddressSync(
      [Buffer.from("vault")],
      program.programId
    )[0];
    return pdaAddress;
  }

  const handleVote = async () => {
    setIsLoading(true);
    try {
      if (!publicKey) {
        await connect();
        return;
      }
      if (!program) return;
      const contestAccount = await program.account.contest.fetch(
        CONTEST_ADDRESS
      );

      const contestantId = new BN(contestant.onChainId);

      const voterRecordPDA = PublicKey.findProgramAddressSync(
        [
          Buffer.from("vote_account"),
          publicKey.toBuffer(),
          contestAccount.id.toArrayLike(Buffer, "le", 8),
          contestantId.toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      )[0];

      const dollarsInEth = 0.1 / (ethPrice?.ethereum.usd || 3200);

      const voteTransaction = await program.methods
        .vote(new BN(dollarsInEth * LAMPORTS_PER_SOL), contestantId)
        .accounts({
          contest: CONTEST_ADDRESS,
          voter: publicKey!,
          vault: getVaultAddress(),
          voterRecord: voterRecordPDA,
          systemProgram: SystemProgram.programId,
        })
        .transaction();

      voteTransaction.feePayer = publicKey;
      voteTransaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;

      const hash = await sendTransaction(voteTransaction);

      if (hash && hash.signature) {
        toast({
          title: "Vote transaction sent",
          action: (
            <Button
              variant="link"
              className="text-[#98FB98] hover:text-[#98FB98]/80 h-auto p-0"
              onClick={() =>
                window.open(
                  `https://eclipsescan.xyz/tx/${hash.signature}`,
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
        queryKey: ["AllVotes"],
      });
    } catch (error) {
      console.log("error voting on contestant", error);
      toast({
        title: "Transaction Failed",
        description: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MotionCard
      key={contestant.id}
      className="bg-black border-[#98FB98] border-[0.8px] shadow-lg shadow-[#98FB98]/10 backdrop-blur-sm rounded-lg"
      whileHover={{
        y: -10,
        transition: { duration: 0.3 },
      }}
    >
      <CardHeader className="pb-2 space-y-2 my-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold font-barlow text-white">
            {contestant.productName}
          </h3>
          {contestant.projectLink && (
            <a
              href={ensureHttps(contestant.projectLink)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#98FB98] hover:text-[#98FB98]/80 transition-colors"
              aria-label={`Visit ${contestant.productName}'s project`}
            >
              {getLinkIcon(contestant.projectLink)}
            </a>
          )}
        </div>
        <div className="flex flex-wrap gap-x-2">
          {contestant.category.map((category, catIndex) => (
            <Badge
              key={catIndex}
              variant="outline"
              className="bg-[#98FB98] text-black text-xs"
            >
              {category}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <GoogleDriveImage
          fileId={contestant.logo}
          alt={`${contestant.productName}`}
          onError={(err: unknown) =>
            console.error("Image failed to load:", err)
          }
          size="sm"
        />
        <p className="text-sm min-h-16 w-full break-words mt-4 text-white">
          {truncateDescription(contestant.description, 100)}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link" className="text-[#98FB98] p-0 h-auto ml-1">
                See more
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black text-white border border-[#98FB98] max-h-[90vh] overflow-y-auto w-full md:max-w-[32rem] max-w-[90vw]">
              <DialogHeader>
                <DialogTitle className="text-[#98FB98] flex items-center justify-between">
                  <span>{contestant.productName}</span>
                </DialogTitle>
              </DialogHeader>
              <GoogleDriveImage
                fileId={contestant.logo}
                alt={`${contestant.productName}`}
                size="lg"
                onError={(err: unknown) =>
                  console.error("Image failed to load:", err)
                }
                className="w-full h-52 mb-4 rounded-xl"
              />

              <div className="mt-4 w-full break-words overflow-hidden">
                <p className="break-words overflow-ellipsis text-white">
                  {contestant.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {contestant.category.map((category, catIndex) => (
                  <Badge
                    key={catIndex}
                    variant="outline"
                    className="bg-[#98FB98] text-black"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleVote}
          className="bg-[#98FB98] text-black font-inter font-semibold px-6 text-md w-full hover:bg-white"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Vote"}
        </Button>
      </CardFooter>
    </MotionCard>
  );
}

export default ContestantCard;
