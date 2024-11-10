CREATE TABLE IF NOT EXISTS "contest" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"start_date" timestamp DEFAULT now() NOT NULL,
	"end_date" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "contest_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contest_participant" (
	"id" text PRIMARY KEY NOT NULL,
	"contest_id" text NOT NULL,
	"contestant_id" text NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contestant" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"team_name" text NOT NULL,
	"product_name" text NOT NULL,
	"description" text NOT NULL,
	"category" text[] NOT NULL,
	"votes" integer DEFAULT 0 NOT NULL,
	"logo" text NOT NULL,
	"headshot" text NOT NULL,
	"eclipse_address" text NOT NULL,
	"on_chain_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "contestant_on_chain_id_unique" UNIQUE("on_chain_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contest_participant" ADD CONSTRAINT "contest_participant_contest_id_contest_id_fk" FOREIGN KEY ("contest_id") REFERENCES "public"."contest"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contest_participant" ADD CONSTRAINT "contest_participant_contestant_id_contestant_id_fk" FOREIGN KEY ("contestant_id") REFERENCES "public"."contestant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "contest_is_active_idx" ON "contest" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "contest_date_range_idx" ON "contest" USING btree ("start_date","end_date");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "contest_participant_unique_idx" ON "contest_participant" USING btree ("contest_id","contestant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "contest_participant_contest_id_idx" ON "contest_participant" USING btree ("contest_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "contest_participant_contestant_id_idx" ON "contest_participant" USING btree ("contestant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "contestant_team_name_idx" ON "contestant" USING btree ("team_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "contestant_product_name_idx" ON "contestant" USING btree ("product_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "contestant_votes_idx" ON "contestant" USING btree ("votes");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "contestant_on_chain_id_idx" ON "contestant" USING btree ("on_chain_id");