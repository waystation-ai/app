CREATE TABLE "connections" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" varchar(100) NOT NULL,
	"provider" varchar(50) NOT NULL,
	"metadata" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
