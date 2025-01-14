import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { tasks } from '../db/schema.js';
import { NewTask, Task } from '../entities/index.js';

export class TaskRepository {
    async findById(pid: string): Promise<Task | null> {
        const [result] = await db.select().from(tasks).where(eq(tasks.public_id, pid));
        return result ?? null;
    }

    async findAll(): Promise<Task[]> {
        const result = await db.select().from(tasks);
        return result as Task[];
    }

    async create(todo: NewTask): Promise<Task> {
        const [newTodo] = await db.insert(tasks).values(todo).returning();
        return newTodo!;
    }

    async update(pid: string, data: Partial<Task>): Promise<Task | null> {
        const [result] = await db.update(tasks).set(data).where(eq(tasks.public_id, pid)).returning();
        return result ?? null;
    }

    async delete(pid: string): Promise<boolean> {
        const [result] = await db.delete(tasks).where(eq(tasks.public_id, pid)).returning();
        return result?.public_id === pid;
    }
}

export const taskRepository = new TaskRepository();
