import { Router } from "express";
import {
  completeTasks,
  deleteTasks,
  getSingleTask,
  getTasks,
  postTasks,
  putTasks,
} from "../controllers/index.js";

const router = Router();

router.get("/tasks", getTasks);
router.post("/tasks", postTasks);
router.get("/tasks/:pid", getSingleTask);
router.put("/tasks/:pid", putTasks);
router.put("/tasks/complete/:pid", completeTasks);
router.delete("/tasks/:pid", deleteTasks);

export default router;
