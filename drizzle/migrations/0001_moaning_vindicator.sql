ALTER TABLE "contest" RENAME TO "Contest";--> statement-breakpoint
ALTER TABLE "contest_participant" RENAME TO "ContestParticipant";--> statement-breakpoint
ALTER TABLE "contestant" RENAME TO "Contestant";--> statement-breakpoint
ALTER TABLE "Contest" DROP CONSTRAINT "contest_name_unique";--> statement-breakpoint
ALTER TABLE "Contestant" DROP CONSTRAINT "contestant_on_chain_id_unique";--> statement-breakpoint
ALTER TABLE "ContestParticipant" DROP CONSTRAINT "contest_participant_contest_id_contest_id_fk";
--> statement-breakpoint
ALTER TABLE "ContestParticipant" DROP CONSTRAINT "contest_participant_contestant_id_contestant_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ContestParticipant" ADD CONSTRAINT "ContestParticipant_contest_id_Contest_id_fk" FOREIGN KEY ("contest_id") REFERENCES "public"."Contest"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ContestParticipant" ADD CONSTRAINT "ContestParticipant_contestant_id_Contestant_id_fk" FOREIGN KEY ("contestant_id") REFERENCES "public"."Contestant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "Contest" ADD CONSTRAINT "Contest_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "Contestant" ADD CONSTRAINT "Contestant_on_chain_id_unique" UNIQUE("on_chain_id");