import { NextResponse } from "next/server";
import { db } from "../../../../drizzle/client";
import {
  contestant,
  contestParticipant,
  contest,
} from "../../../../drizzle/schema";
import { CONTEST_ID } from "@/lib/constant";
import { desc, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const runtime = "edge";
const sampleContestants = [
  {
    name: "Sarah Chen",
    productName: "DeFi Bridge Pro",
    description:
      "A secure cross-chain bridge solution with enhanced liquidity management and real-time transaction monitoring. Features include atomic swaps, MEV protection, and multi-chain support for major networks.",
    category: ["DeFi", "Infrastructure"],
    logo: "https://miro.medium.com/v2/resize:fit:1400/0*ZC0rsBiDGDmjOTI_",
    projectLink: "https://github.com/defi-bridge-pro",
  },
  {
    name: "Marcus Rodriguez",
    productName: "ChainSync Analytics",
    description:
      "Advanced blockchain analytics platform with ML-powered insights and customizable dashboards. Provides real-time monitoring, anomaly detection, and predictive analytics for blockchain networks.",
    category: ["Analytics", "Developer Tools"],
    logo: "https://miro.medium.com/v2/resize:fit:1400/0*ZC0rsBiDGDmjOTI_",
    projectLink: "https://github.com/chainsync-analytics",
  },
  {
    name: "Emma Watson",
    productName: "EcoStake",
    description:
      "Sustainable staking platform that rewards environmentally conscious validator selection. Includes carbon offset tracking and green energy certification for validators.",
    category: ["DeFi", "Sustainability"],
    logo: "https://miro.medium.com/v2/resize:fit:1400/0*ZC0rsBiDGDmjOTI_",
    projectLink: "https://github.com/eco-stake",
  },
  {
    name: "Alex Kim",
    productName: "ChainGuard",
    description:
      "Real-time smart contract monitoring and vulnerability detection system. Features automated auditing, threat detection, and emergency response protocols.",
    category: ["Security", "Infrastructure"],
    logo: "https://miro.medium.com/v2/resize:fit:1400/0*ZC0rsBiDGDmjOTI_",
    projectLink: "https://github.com/chain-guard",
  },
  {
    name: "Lisa Patel",
    productName: "MetaRealms",
    description:
      "Cross-chain gaming metaverse with integrated NFT marketplace and play-to-earn mechanics. Supports multiple game genres and cross-game asset compatibility.",
    category: ["Gaming", "NFT"],
    logo: "https://miro.medium.com/v2/resize:fit:1400/0*ZC0rsBiDGDmjOTI_",
    projectLink: "https://github.com/meta-realms",
  },
  {
    name: "David Zhang",
    productName: "DID Connect",
    description:
      "Decentralized identity solution with privacy-preserving verification and credential management. Supports zero-knowledge proofs and selective disclosure.",
    category: ["Identity", "Privacy"],
    logo: "https://miro.medium.com/v2/resize:fit:1400/0*ZC0rsBiDGDmjOTI_",
    projectLink: "https://github.com/did-connect",
  },
];

export async function POST(req: Request) {
  try {
    // Start transaction
    // await client.query("BEGIN");

    // First, ensure the contest exists
    const [existingContest] = await db
      .select()
      .from(contest)
      .where(eq(contest.id, CONTEST_ID))
      .limit(1);

    if (!existingContest) {
      // Create the contest if it doesn't exist
      await db.insert(contest).values({
        id: CONTEST_ID,
        name: "Eclipse Hackathon 2024",
        description: "Building the future of blockchain technology",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Get the last onChainId
    const [lastContestant] = await db
      .select({ onChainId: contestant.onChainId })
      .from(contestant)
      .orderBy(desc(contestant.onChainId))
      .limit(1);

    let nextOnChainId = (lastContestant?.onChainId ?? 0) + 1;
    const contestants = [];

    // Insert contestants
    for (const data of sampleContestants) {
      const contestantId = uuidv4();

      // Insert contestant
      const [newContestant] = await db
        .insert(contestant)
        .values({
          id: contestantId,
          name: data.name,
          productName: data.productName,
          description: data.description,
          category: data.category,
          logo: data.logo,
          projectLink: data.projectLink,
          eclipseAddress: `0x${uuidv4().replace(/-/g, "")}`,
          onChainId: nextOnChainId++,
          votes: Math.floor(Math.random() * 100),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning();

      // Create contest participant relationship
      await db.insert(contestParticipant).values({
        id: uuidv4(),
        contestId: CONTEST_ID,
        contestantId: contestantId,
        joinedAt: new Date().toISOString(),
      });

      contestants.push(newContestant);
    }

    // Commit transaction
    // await client.query("COMMIT");

    return NextResponse.json(
      {
        success: true,
        message: `Successfully created ${contestants.length} contestants`,
        data: contestants,
      },
      { status: 201 }
    );
  } catch (error) {
    // Rollback transaction on error
    // await client.query("ROLLBACK");
    console.error("Error populating database:", error);

    if (
      error instanceof Error &&
      (error.message.includes("unique constraint") ||
        error.message.includes("duplicate key"))
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Duplicate entries",
          message: "Some contestants already exist in the database",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  } finally {
    // Release the client back to the pool
    // client.release();
  }
}
