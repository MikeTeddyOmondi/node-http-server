import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./dist/db/schema.js",
  out: "./migrations",
  driver: "mysql2",
  dbCredentials: {
    host: process.env.DATABASE_HOST!,
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD!,
    database: process.env.DATABASE_NAME!,
  },
} satisfies Config;
