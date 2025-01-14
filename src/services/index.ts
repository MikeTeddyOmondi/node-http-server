import { NewTask, Task } from "../entities/index.js";
import { taskRepository, TaskRepository } from "../repositories/index.js";


class TaskService {
    private tasks: TaskRepository;

    constructor(taskRepository: TaskRepository) {
        this.tasks = taskRepository;
    }

    async getTaskById(id: string): Promise<Task | null> {
        return this.tasks.findById(id);
    }

    async getAllTasks(): Promise<Task[]> {
        return this.tasks.findAll();
    }

    async createTasks(todo: NewTask): Promise<Task> {
        return this.tasks.create(todo);
    }

    async updateTasks(id: string, data: Partial<Task>): Promise<Task | null> {
        return this.tasks.update(id, data);
    }

    async deleteTasks(id: string): Promise<boolean> {
        return this.tasks.delete(id);
    }
}

export const taskService = new TaskService(taskRepository);
