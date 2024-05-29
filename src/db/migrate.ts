// import { config } from "dotenv";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";

// config();

import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_USER,
} from "../config.js";

const connection = await mysql.createConnection({
  host: DATABASE_HOST,
  user: DATABASE_USER,
  database: DATABASE_NAME,
  password: DATABASE_PASSWORD,
  multipleStatements: true,
});

export const db = drizzle(connection);

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
