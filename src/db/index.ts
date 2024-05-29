import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_USER,
} from "../config.js";

const poolConnection = mysql.createPool({
  host: DATABASE_HOST,
  user: DATABASE_USER,
  database: DATABASE_NAME,
  password: DATABASE_PASSWORD,
});

export const db = drizzle(poolConnection);
