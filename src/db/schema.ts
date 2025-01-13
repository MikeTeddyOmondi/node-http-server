import {
  integer,
  pgEnum,
  pgTable,
  uniqueIndex,
  varchar,
  boolean,
  serial,
} from "drizzle-orm/pg-core";

export const tasks = pgTable("tasks", {
  id: serial("id").notNull().primaryKey().unique(),
  public_id: varchar("public_id", { length: 1024 }).notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  description: varchar("description", { length: 512 }).notNull(),
  completed: boolean("completed").notNull().default(false),
});

export const countries = pgTable("countries", {
  id: integer("id").primaryKey().unique(),
  name: varchar("name", { length: 256 }),
});

export const popularityEnum = pgEnum("popularity", [
  "unknown",
  "known",
  "popular",
]);

export const cities = pgTable("cities", {
  id: integer("id").primaryKey().unique(),
  name: varchar("name", { length: 256 }),
  countryId: integer("country_id").references(() => countries.id),
  popularity: popularityEnum("popularity"),
});
