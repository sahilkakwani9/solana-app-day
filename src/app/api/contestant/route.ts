export const runtime = 'edge';
import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { Prisma } from "@prisma/client";
import { CONTEST_ID } from "@/lib/constant";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const page = parseInt(searchParams.get("page") ?? "1");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    const where: Prisma.ContestantWhereInput = {
      contests: {
        some: {
          contestId: CONTEST_ID,
        },
      },
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { teamName: { contains: search, mode: "insensitive" } },
          { productName: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [contestants, total] = await Promise.all([
      prisma.contestant.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: "desc" },
        include: {
          contests: true,
        },
      }),
      prisma.contestant.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: contestants,
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
