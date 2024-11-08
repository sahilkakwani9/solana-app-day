import { NextResponse } from "next/server";
import { and, desc, ilike, or, sql, eq } from "drizzle-orm";
import { db } from "../../../../drizzle/client";
import { contestant, contestParticipant } from "../../../../drizzle/schema";
import { CONTEST_ID } from "@/lib/constant";

export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const page = parseInt(searchParams.get("page") ?? "1");
    const search = searchParams.get("search");

    const offset = (page - 1) * limit;

    // Build the base query conditions
    let conditions = [eq(contestParticipant.contestId, CONTEST_ID)];

    // Add search conditions if search parameter exists
    if (search) {
      conditions.push(
        or(
          ilike(contestant.name, `%${search}%`),
          ilike(contestant.teamName, `%${search}%`),
          ilike(contestant.productName, `%${search}%`)
        )
      );
    }

    // Query for contestants with pagination
    const contestantsQuery = db
      .select({
        contestant: contestant,
        contestParticipant: contestParticipant,
      })
      .from(contestant)
      .innerJoin(
        contestParticipant,
        eq(contestant.id, contestParticipant.contestantId)
      )
      .where(and(...conditions))
      .orderBy(desc(contestant.createdAt))
      .limit(limit)
      .offset(offset);

    // Count total records
    const countQuery = db
      .select({
        count: sql<number>`cast(count(*) as integer)`,
      })
      .from(contestant)
      .innerJoin(
        contestParticipant,
        eq(contestant.id, contestParticipant.contestantId)
      )
      .where(and(...conditions));

    // Execute both queries in parallel
    const [contestants, [{ count: total }]] = await Promise.all([
      contestantsQuery,
      countQuery,
    ]);

    return NextResponse.json({
      success: true,
      data: contestants.map(({ contestant, contestParticipant }) => ({
        ...contestant,
        contests: [contestParticipant],
      })),
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching contestants:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
