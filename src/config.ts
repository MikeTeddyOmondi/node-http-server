import { config } from "dotenv";

config();

export const NODE_ENV = process.env.NODE_ENV!;
export const DATABASE_HOST = process.env.DATABASE_HOST!;
export const DATABASE_USER = process.env.DATABASE_USER!;
export const DATABASE_NAME = process.env.DATABASE_NAME!;
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD!;
