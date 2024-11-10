ALTER TABLE "Contestant" RENAME COLUMN "headshot" TO "projectLink";--> statement-breakpoint
ALTER TABLE "Contest" DROP CONSTRAINT "Contest_name_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "Contestant_teamName_idx";--> statement-breakpoint
ALTER TABLE "Contestant" DROP COLUMN IF EXISTS "teamName";--> statement-breakpoint
ALTER TABLE "Contestant" DROP COLUMN IF EXISTS "eclipseAddress";