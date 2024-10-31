import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password } = body;
    if (password === process.env.PASSWORD) {
      return NextResponse.json(
        {
          success: true,
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        success: false,
      },
      { status: 403 },
    );
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
