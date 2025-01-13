import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const { Pool } = pg;

import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_USER,
} from "../config.js";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 3,
  host: DATABASE_HOST,
  user: DATABASE_USER,
  database: DATABASE_NAME,
  password: DATABASE_PASSWORD,
});

export const db = drizzle(pool);
