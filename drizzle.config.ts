import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./dist/src/db/schema.js",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DATABASE_HOST!,
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD!,
    database: process.env.DATABASE_NAME!,
    ssl: process.env.NODE_ENV === "production" ? true : false 
  },
} satisfies Config;
