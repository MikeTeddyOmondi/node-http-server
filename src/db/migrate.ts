import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

const { Client } = pg;

import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_USER,
} from "../config.js";

const connection = new Client({
  connectionString: process.env.DATABASE_URL,
  host: DATABASE_HOST,
  user: DATABASE_USER,
  database: DATABASE_NAME,
  password: DATABASE_PASSWORD,
});

const db = drizzle(connection);

async function main() {
  try {
    await migrate(db, { migrationsFolder: "migrations" });
  } catch (error) {
    console.log(`[!] Migration error: ${error}`);
    await connection.end();
  }
  await connection.end();
}

main();
