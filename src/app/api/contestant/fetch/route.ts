import { google } from "googleapis";
import { NextResponse } from "next/server";
import { auth } from "../../../../lib/google";
import { db } from "../../../../../drizzle/client";
import { contestant, contestParticipant } from "../../../../../drizzle/schema";
import { CONTEST_ID } from "@/lib/constant";
import { desc, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export interface GoogleFormResponse {
  timestamp: string;
  email_address: string;
  name: string;
  product_name: string;
  product_description: string;
  category: string | string[];
  product_logo?: string;
  project_link: string;
  [key: string]: string | string[] | undefined;
}

function cleanKey(key: string): string {
  return key
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

// Helper function to extract Google Drive file ID
function extractDriveFileId(url: string): string {
  // Handle different Google Drive URL formats
  const patterns = [
    /\/open\?id=([a-zA-Z0-9_-]+)/, // Format: open?id=FILE_ID
    /\/file\/d\/([a-zA-Z0-9_-]+)/, // Format: file/d/FILE_ID
    /id=([a-zA-Z0-9_-]+)/, // Format: id=FILE_ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return url; // Return original URL if no ID found
}

// Helper function to check for duplicate product names
async function isDuplicate(productName: string): Promise<boolean> {
  const existing = await db
    .select({ id: contestant.id })
    .from(contestant)
    .where(eq(contestant.productName, productName))
    .limit(1);

  return existing.length > 0;
}

// Helper function to parse categories
function parseCategories(categoryData: string | string[]): string[] {
  if (Array.isArray(categoryData)) {
    return categoryData;
  }

  // If it's a string, try different delimiters
  if (typeof categoryData === "string") {
    // Try comma first
    if (categoryData.includes(",")) {
      return categoryData
        .split(",")
        .map((cat) => cat.trim())
        .filter(Boolean);
    }
    // Try semicolon
    if (categoryData.includes(";")) {
      return categoryData
        .split(";")
        .map((cat) => cat.trim())
        .filter(Boolean);
    }
    // If no delimiters found, treat as single category
    return [categoryData.trim()];
  }

  // Default to empty array if undefined or invalid
  return [];
}

export async function GET() {
  try {
    const sheets = google.sheets({ version: "v4", auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Form Responses 1",
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "No data found." },
        { status: 404 }
      );
    }

    const headers = rows[0].map((header: string) => cleanKey(header));
    const formResponses = rows.slice(1).map((row: string[]) => {
      const formResponse: { [key: string]: string } = {};
      row.forEach((value: string, index: number) => {
        formResponse[headers[index]] = value;
      });
      return formResponse as GoogleFormResponse;
    });

    const [lastContestant] = await db
      .select({ onChainId: contestant.onChainId })
      .from(contestant)
      .orderBy(desc(contestant.onChainId))
      .limit(1);

    let nextOnChainId = (lastContestant?.onChainId ?? 0) + 1;
    const contestants = [];
    const processedProducts = new Set(); // Track processed products

    for (const formData of formResponses) {
      try {
        // Skip if product name is empty or already processed
        if (
          !formData.product_name ||
          processedProducts.has(formData.product_name)
        ) {
          console.log(
            `Skipping duplicate or empty product: ${formData.product_name}`
          );
          continue;
        }

        // Check for existing product in database
        if (await isDuplicate(formData.product_name)) {
          console.log(
            `Skipping existing product in DB: ${formData.product_name}`
          );
          continue;
        }

        const categories = parseCategories(formData.category);
        const contestantId = uuidv4();

        // Extract Drive file ID from logo URL
        const driveFileId = formData.product_logo
          ? extractDriveFileId(formData.product_logo)
          : "";

        const [newContestant] = await db
          .insert(contestant)
          .values({
            id: contestantId,
            name: formData.your_name,
            productName: formData.product_name,
            description: formData.product_description_two_sentences_max,
            category: categories,
            logo: driveFileId!,
            projectLink: formData.project_twitterwebsite,
            onChainId: nextOnChainId++,
            votes: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
          .returning();

        await db.insert(contestParticipant).values({
          id: uuidv4(),
          contestId: CONTEST_ID,
          contestantId: contestantId,
          joinedAt: new Date().toISOString(),
        });

        contestants.push(newContestant);
        processedProducts.add(formData.product_name);
      } catch (error) {
        console.error("Error processing form entry:", {
          productName: formData.product_name,
          error: error instanceof Error ? error.message : error,
        });
        continue;
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Successfully created ${contestants.length} unique contestants from form responses`,
        data: contestants,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing form responses:", error);

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
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
