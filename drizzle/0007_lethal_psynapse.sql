CREATE TABLE "oauth_clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"client_secret" text NOT NULL,
	"client_metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "oauth_clients_client_id_unique" UNIQUE("client_id")
);
--> statement-breakpoint
CREATE TABLE "oauth_redirect_mappings" (
	"id" serial PRIMARY KEY NOT NULL,
	"state" text NOT NULL,
	"client_id" text NOT NULL,
	"original_redirect_uri" text NOT NULL,
	"original_state" text,
	"code_verifier" text,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "oauth_redirect_mappings_state_unique" UNIQUE("state")
);
