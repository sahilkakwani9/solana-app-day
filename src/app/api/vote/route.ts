export const runtime = 'edge';
import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "../../../../drizzle/client";
import { CONTEST_ID } from "@/lib/constant";

const voteSchema = z.object({
  contestantId: z.string().min(1, "Contestant ID is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { contestantId } = voteSchema.parse(body);

    // Check if contest exists and is active
    const contest = await prisma.contest.findUnique({
      where: {
        id: CONTEST_ID,
        isActive: true,
        endDate: {
          gt: new Date(),
        },
      },
    });

    if (!contest) {
      return NextResponse.json(
        {
          success: false,
          error: "Contest not found or has ended",
        },
        { status: 404 }
      );
    }

    // Check if contestant exists and is part of the contest
    const contestParticipant = await prisma.contestParticipant.findUnique({
      where: {
        contestId_contestantId: {
          contestId: CONTEST_ID,
          contestantId,
        },
      },
    });

    if (!contestParticipant) {
      return NextResponse.json(
        {
          success: false,
          error: "Contestant not found in this contest",
        },
        { status: 404 }
      );
    }

    const updatedContestant = await prisma.$transaction(async (tx) => {
      // Get current contestant for optimistic locking
      const currentContestant = await tx.contestant.findUnique({
        where: { id: contestantId },
      });

      if (!currentContestant) {
        throw new Error("Contestant not found");
      }

      // Increment votes
      return tx.contestant.update({
        where: { id: contestantId },
        data: {
          votes: { increment: 1 },
        },
        select: {
          id: true,
          name: true,
          votes: true,
          teamName: true,
          productName: true,
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        data: updatedContestant,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing vote:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
