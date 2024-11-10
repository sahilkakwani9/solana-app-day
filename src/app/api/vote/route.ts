import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "../../../../drizzle/client";
import {
  contestant,
  contestParticipant,
  contest,
} from "../../../../drizzle/schema";
import { CONTEST_ID } from "@/lib/constant";
import { and, eq, gt, sql } from "drizzle-orm";

export const runtime = "edge";

const voteSchema = z.object({
  contestantId: z.string().min(1, "Contestant ID is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { contestantId } = voteSchema.parse(body);

    // Check if contest exists and is active
    const [activeContest] = await db
      .select()
      .from(contest)
      .where(
        and(
          eq(contest.id, CONTEST_ID),
          eq(contest.isActive, true),
          gt(contest.endDate, new Date().toISOString())
        )
      )
      .limit(1);

    if (!activeContest) {
      return NextResponse.json(
        {
          success: false,
          error: "Contest not found or has ended",
        },
        { status: 404 }
      );
    }

    // Check if contestant exists and is part of the contest
    const [participation] = await db
      .select()
      .from(contestParticipant)
      .where(
        and(
          eq(contestParticipant.contestId, CONTEST_ID),
          eq(contestParticipant.contestantId, contestantId)
        )
      )
      .limit(1);

    if (!participation) {
      return NextResponse.json(
        {
          success: false,
          error: "Contestant not found in this contest",
        },
        { status: 404 }
      );
    }

    // Get current contestant
    const [currentContestant] = await db
      .select()
      .from(contestant)
      .where(eq(contestant.id, contestantId))
      .limit(1);

    if (!currentContestant) {
      return NextResponse.json(
        {
          success: false,
          error: "Contestant not found",
        },
        { status: 404 }
      );
    }

    // Increment votes
    const [updatedContestant] = await db
      .update(contestant)
      .set({
        votes: sql`${contestant.votes} + 1`,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(contestant.id, contestantId))
      .returning({
        id: contestant.id,
        name: contestant.name,
        votes: contestant.votes,
        productName: contestant.productName,
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
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
