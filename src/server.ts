import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

import { db } from "./db/index.js";
import { tasks } from "./db/schema.js";
import { ResponseError, createError, logger } from "./utils/index.js";
import { NODE_ENV } from "./config.js";

config();

const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const port = 3000;

async function main() {
  // Root route
  app.get("/", (req, res, next) => {
    logger.info({ success: true, message: "Application works!" });
    res.json({ success: true, message: "Application works!" });
  });

  app.get("/tasks", async (req, res, next) => {
    try {
      const result = await db.select().from(tasks);
      logger.info({ data: result }, "Task(s) read!");
      res.json({ success: true, message: "Task(s) read!", data: result });
    } catch (err: any) {
      logger.error(`Error reading task(s): ${err.message}`);
      next(createError(500, `Error reading task(s): ${err.message}`));
    }
  });

  app.post("/tasks", async (req, res, next) => {
    try {
      const public_id = uuid();
      const { title, description } = req.body;
      if (
        title === "" ||
        title === undefined ||
        description === "" ||
        description === undefined
      ) {
        logger.error(
          "Error creating task(s): Please provide a title & a description"
        );
        return res.status(400).json({
          success: false,
          message: "Please provide a title & a description!",
        });
      }

      type NewTask = typeof tasks.$inferInsert;

      const newTask: NewTask = {
        public_id,
        description,
        title,
      };

      const [result] = await db.insert(tasks).values(newTask).returning();

      logger.info({ data: result }, "Task(s) created!");
      res
        .status(201)
        .json({ success: true, message: "Task(s) created!", data: result });
    } catch (err: any) {
      logger.error(`Error creating task(s): ${err.message}`);
      next(createError(500, `Error creating task(s): ${err}`));
    }
  });

  app.get("/tasks/:pid", async (req, res, next) => {
    try {
      const { pid } = req.params;
      const result = await db
        .select()
        .from(tasks)
        .where(eq(tasks.public_id, pid));

      if (result.length === 0) {
        logger.error(`Tasks(s): ${pid} not found!`);
        return res.status(404).json({
          success: false,
          message: "Task(s) not found!",
        });
      }

      logger.info({ data: result }, "Task(s) read");
      res.json({ success: true, message: "Task(s) read!", data: result });
    } catch (err: any) {
      logger.error(`Error reading task(s): ${err.message}`);
      next(createError(500, `Error reading task(s): ${err.message}`));
    }
  });

  app.put("/tasks/:pid", async (req, res, next) => {
    try {
      const { pid } = req.params;
      const { title, description } = req.body;
      if (title === "" || description === "") {
        logger.error(
          "Error updating task(s): Please provide a title & a description to update!"
        );
        return res.status(400).json({
          success: false,
          message: "Please provide a title & a description to update!",
        });
      }

      const [result] = await db
        .update(tasks)
        .set({ title, description })
        .where(eq(tasks.public_id, pid))
        .returning();

      logger.info({ data: result }, `Task(s): ${pid} updated!`);
      res.json({
        success: true,
        message: "Task(s) updated!",
        data: result,
      });
    } catch (err: any) {
      logger.error(`Error updating task(s): ${err.message}`);
      next(createError(500, `Error reading task(s): ${err.message}`));
    }
  });

  app.put("/tasks/complete/:pid", async (req, res, next) => {
    try {
      const { pid } = req.params;
      const [fetchResult] = await db
        .select()
        .from(tasks)
        .where(eq(tasks.public_id, pid));
      const result = await db
        .update(tasks)
        .set({ completed: fetchResult?.completed ? false : true })
        .where(eq(tasks.public_id, pid));
      // .returning();

      logger.info(`Task(s): ${pid} completed!`);
      res.json({
        success: true,
        message: "Task(s) completed!",
        data: result,
      });
    } catch (err: any) {
      logger.error(`Error completing task(s): ${err.message}`);
      next(createError(500, `Error completing task(s): ${err.message}`));
    }
  });

  app.delete("/tasks/:pid", async (req, res, next) => {
    try {
      const { pid } = req.params;
      const result = await db
        .delete(tasks)
        .where(eq(tasks.public_id, pid))
        .returning();
      if (result.length === 0) {
        logger.error(`Error deleting task(s): ${pid} not found!`);
        return res.status(404).json({
          success: false,
          message: `Task(s): ${pid} not found!`,
        });
      }
      res.json({
        success: true,
        message: `Task(s): ${pid} deleted!`,
        data: result,
      });
    } catch (err: any) {
      logger.error(`Error deleting task(s): ${err.message}`);
      next(createError(500, `Error deleting task(s): ${err.message}`));
    }
  });

  // 404 route
  app.get("*", (req, res, next) => {
    logger.error("Resource Not Found!");
    next(createError(500, `Resource Not Found!`));
  });

  // Error Middleware
  app.use(
    (err: ResponseError, req: Request, res: Response, next: NextFunction) => {
      const errorStatus = err.status || 500;
      const errorMessage = err.message || "Something went wrong!";
      return res.status(errorStatus).json({
        success: false,
        data: {
          message: errorMessage,
        },
        stack: NODE_ENV === "production" ? {} : err.stack,
      });
    }
  );

  const PORT = process.env.PORT || 3489;

  app.listen(PORT, () => {
    console.log(`Server listening for requests: http://localhost:${PORT}`);
  });
}

// Start HTTP Server
main();
