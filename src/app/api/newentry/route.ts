import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "../../../../drizzle/client";
import { contestant, contestParticipant } from "../../../../drizzle/schema";
import { CONTEST_ID } from "@/lib/constant";
import { desc } from "drizzle-orm";

export const runtime = "edge";

const createContestantSchema = z.object({
  timestamp: z.string().datetime(),
  name: z.string().min(1, "Name is required"),
  team_name: z.string().min(1, "Team name is required"),
  product_name: z.string().min(1, "Product name is required"),
  product_description: z.string().min(1, "Product description is required"),
  category: z.array(z.string()).min(1, "At least one category is required"),
  team_logo_image: z
    .array(z.string())
    .length(1, "Exactly one team logo is required"),
  speacker_headshot: z
    .array(z.string())
    .length(1, "Exactly one headshot is required"),
  eclipse_wallet_address: z
    .string()
    .min(1, "Eclipse wallet address is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = createContestantSchema.parse(body);

    // Get the last onChainId using Drizzle syntax
    const [lastContestant] = await db
      .select({ onChainId: contestant.onChainId })
      .from(contestant)
      .orderBy(desc(contestant.onChainId))
      .limit(1);

    const nextOnChainId = (lastContestant?.onChainId ?? 0) + 1;

    // Using Drizzle's transaction
    const result = await db.transaction(async (tx) => {
      // Insert contestant
      const [newContestant] = await tx
        .insert(contestant)
        .values({
          name: validatedData.name,
          teamName: validatedData.team_name,
          productName: validatedData.product_name,
          description: validatedData.product_description,
          category: validatedData.category,
          logo: validatedData.team_logo_image[0],
          headshot: validatedData.speacker_headshot[0],
          eclipseAddress: validatedData.eclipse_wallet_address,
          onChainId: nextOnChainId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      // Create contest participant relationship
      await tx.insert(contestParticipant).values({
        contestId: CONTEST_ID,
        contestantId: newContestant.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return newContestant;
    });

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating contestant:", error);

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

    if (
      error instanceof Error &&
      (error.message.includes("unique constraint") ||
        error.message.includes("duplicate key"))
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Duplicate entry",
          message: "A contestant with this info already exists",
        },
        { status: 409 }
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
