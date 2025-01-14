import { tasks } from "../db/schema.js";

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;