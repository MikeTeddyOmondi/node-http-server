CREATE TYPE "public"."popularity" AS ENUM('unknown', 'known', 'popular');--> statement-breakpoint
CREATE TABLE "cities" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"country_id" integer,
	"popularity" "popularity",
	CONSTRAINT "cities_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(256),
	CONSTRAINT "countries_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" varchar(1024) NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" varchar(512) NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	CONSTRAINT "tasks_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "cities" ADD CONSTRAINT "cities_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;