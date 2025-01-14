import { v4 as uuid } from "uuid";
import { Request, Response, NextFunction } from "express";

import { taskService } from "../services/index.js";
import { createError, logger } from "../utils/index.js";
import { NewTask } from "../entities/index.js";

export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("GET - All tasks");
    const alltodos = await taskService.getAllTasks();
    logger.info({ data: alltodos }, "Task(s) read!");
    res.json({ success: true, message: "Task(s) read!", data: alltodos });
  } catch (err: any) {
    logger.error(`Error reading task(s): ${err.message}`);
    return next(createError(500, `Error reading task(s): ${err.message}`));
  }
};

export const postTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("POST - Create Tasks");

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
      return next(
        createError(
          400,
          "Error creating task(s): Please provide a title & a description"
        )
      );
    }

    const newTask: NewTask = {
      public_id,
      description,
      title,
    };

    const savedTask = await taskService.createTasks({ ...newTask });

    logger.info({ data: savedTask }, "Task(s) created!");

    return res
      .status(201)
      .json({ success: true, message: "Task(s) created!", data: savedTask });
  } catch (err: any) {
    logger.error(`Error creating task(s): ${err.message}`);
    return next(createError(500, `Error creating task(s): ${err}`));
  }
};

export const getSingleTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("GET - Single task");
    const { pid } = req.params;

    if (pid === undefined) {
      logger.error(`Error updating task(s): invalid public id ${pid}!`);
      return next(createError(404, `Invalid public id: ${pid}!`));
    }

    const task = await taskService.getTaskById(pid!);

    if (task === null) {
      logger.error(`Tasks(s): ${pid} not found!`);
      return next(createError(404, `Task(s) not found: ${pid}!`));
    }

    logger.info({ data: task }, "Task(s) read");
    res.json({ success: true, message: "Task(s) read!", data: task });
  } catch (err: any) {
    logger.error(`Error reading task(s): ${err.message}`);
    return next(createError(500, `Error reading task(s): ${err.message}`));
  }
};

export const putTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("PUT - Single task");

    const { pid } = req.params;

    if (pid === undefined) {
      logger.error(`Error updating task(s): invalid public id ${pid}!`);
      return next(createError(404, `: Invalid public id: ${pid}!`));
    }

    const { title, description } = req.body as NewTask;
    if (
      title === "" ||
      title === undefined ||
      description === "" ||
      description === undefined
    ) {
      logger.error(
        "Error updating task(s): Please provide a title & a description to update!"
      );
      return next(
        createError(400, "Please provide a title & a description to update!")
      );
    }

    const updatedTask = await taskService.updateTasks(pid, {
      title,
      description,
    });

    if (updatedTask === null) {
      logger.error(`Error completing task(s): ${pid}!`);
      return next(createError(500, `Error completing task(s): ${pid}!`));
    }

    logger.info({ data: updatedTask }, `Task(s): ${pid} updated!`);
    return res.json({
      success: true,
      message: "Task(s) updated!",
      data: updatedTask,
    });
  } catch (err: any) {
    logger.error(`Error updating task(s): ${err.message}`);
    return next(createError(500, `Error reading task(s): ${err.message}`));
  }
};

export const completeTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("PUT - Complete Single task");

    const { pid } = req.params;

    if (pid === undefined) {
      logger.error(`Error completing task(s): invalid public id ${pid}!`);
      return next(createError(404, `Invalid public id: ${pid}!`));
    }

    const foundTask = await taskService.getTaskById(pid);

    if (foundTask === null) {
      logger.error(`Tasks(s): ${pid} not found!`);
      return next(createError(404, `Task(s) not found: ${pid}!`));
    }

    const completedTask = await taskService.updateTasks(foundTask?.public_id, {
      completed: foundTask?.completed ? false : true,
    });

    if (completedTask === null) {
      logger.error(`Error completing task(s): ${pid}!`);
      return next(createError(500, `Error completing task(s): ${pid}!`));
    }

    logger.info(`Task(s): ${pid} completed!`);

    return res.json({
      success: true,
      message: "Task(s) completed!",
      data: completedTask,
    });
  } catch (err: any) {
    logger.error(`Error completing task(s): ${err.message}`);
    return next(createError(500, `Error completing task(s): ${err.message}`));
  }
};

export const deleteTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.info("DELETE - Single task");

    const { pid } = req.params;

    if (pid === undefined) {
      logger.error(`Error deleting task(s): invalid public id ${pid}!`);
      return next(createError(404, `Invalid public id: ${pid}!`));
    }

    const foundTask = await taskService.getTaskById(pid);

    if (foundTask === null) {
      logger.error(`Tasks(s): ${pid} not found!`);
      return next(createError(404, `Task(s) not found: ${pid}!`));
    }

    const deletedTask = await taskService.deleteTasks(pid!);

    if (deletedTask !== true) {
      logger.error(`Error deleting task(s): ${pid}!`);
      return next(createError(500, `Error deleting task(s): ${pid}!`));
    }

    return res.json({
      success: true,
      message: `Task(s): ${pid} deleted!`,
      data: [],
    });
  } catch (err: any) {
    console.error({ err });
    logger.error(`Error deleting task(s): ${err.message}`);
    return next(createError(500, `Error deleting task(s): ${err.message}`));
  }
};
