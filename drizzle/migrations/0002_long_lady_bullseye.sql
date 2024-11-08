ALTER TABLE "Contest" RENAME COLUMN "start_date" TO "startDate";--> statement-breakpoint
ALTER TABLE "Contest" RENAME COLUMN "end_date" TO "endDate";--> statement-breakpoint
ALTER TABLE "Contest" RENAME COLUMN "is_active" TO "isActive";--> statement-breakpoint
ALTER TABLE "Contest" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "Contest" RENAME COLUMN "updated_at" TO "updatedAt";--> statement-breakpoint
ALTER TABLE "ContestParticipant" RENAME COLUMN "contest_id" TO "contestId";--> statement-breakpoint
ALTER TABLE "ContestParticipant" RENAME COLUMN "contestant_id" TO "contestantId";--> statement-breakpoint
ALTER TABLE "ContestParticipant" RENAME COLUMN "joined_at" TO "joinedAt";--> statement-breakpoint
ALTER TABLE "Contestant" RENAME COLUMN "team_name" TO "teamName";--> statement-breakpoint
ALTER TABLE "Contestant" RENAME COLUMN "product_name" TO "productName";--> statement-breakpoint
ALTER TABLE "Contestant" RENAME COLUMN "eclipse_address" TO "eclipseAddress";--> statement-breakpoint
ALTER TABLE "Contestant" RENAME COLUMN "on_chain_id" TO "onChainId";--> statement-breakpoint
ALTER TABLE "Contestant" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "Contestant" RENAME COLUMN "updated_at" TO "updatedAt";--> statement-breakpoint
ALTER TABLE "Contestant" DROP CONSTRAINT "Contestant_on_chain_id_unique";--> statement-breakpoint
ALTER TABLE "ContestParticipant" DROP CONSTRAINT "ContestParticipant_contest_id_Contest_id_fk";
--> statement-breakpoint
ALTER TABLE "ContestParticipant" DROP CONSTRAINT "ContestParticipant_contestant_id_Contestant_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "contest_is_active_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "contest_date_range_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "contest_participant_unique_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "contest_participant_contest_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "contest_participant_contestant_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "contestant_team_name_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "contestant_product_name_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "contestant_votes_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "contestant_on_chain_id_idx";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ContestParticipant" ADD CONSTRAINT "ContestParticipant_contestId_Contest_id_fk" FOREIGN KEY ("contestId") REFERENCES "public"."Contest"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ContestParticipant" ADD CONSTRAINT "ContestParticipant_contestantId_Contestant_id_fk" FOREIGN KEY ("contestantId") REFERENCES "public"."Contestant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Contest_isActive_idx" ON "Contest" USING btree ("isActive");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Contest_startDate_endDate_idx" ON "Contest" USING btree ("startDate","endDate");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ContestParticipant_contestId_contestantId_key" ON "ContestParticipant" USING btree ("contestId","contestantId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ContestParticipant_contestId_idx" ON "ContestParticipant" USING btree ("contestId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ContestParticipant_contestantId_idx" ON "ContestParticipant" USING btree ("contestantId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Contestant_teamName_idx" ON "Contestant" USING btree ("teamName");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Contestant_productName_idx" ON "Contestant" USING btree ("productName");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Contestant_votes_idx" ON "Contestant" USING btree ("votes");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Contestant_onChainId_idx" ON "Contestant" USING btree ("onChainId");--> statement-breakpoint
ALTER TABLE "Contestant" ADD CONSTRAINT "Contestant_onChainId_unique" UNIQUE("onChainId");