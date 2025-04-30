CREATE TABLE "nano_ids" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"nano_id" varchar(21) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "nano_ids_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "nano_ids_nano_id_unique" UNIQUE("nano_id")
);
