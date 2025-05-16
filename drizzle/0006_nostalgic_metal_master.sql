CREATE TABLE "remote_providers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider" varchar(50) NOT NULL,
	"server_url" text,
	"oauth_metadata" jsonb,
	"client_registration" jsonb,
	"provider_metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "remote_providers_user_id_provider_unique" UNIQUE("user_id","provider")
);
