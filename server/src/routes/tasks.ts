import express from "express";
import * as ctrl from "../controllers/taskController";
import { validateCreateTask, validateUpdateTask } from "../middleware/validateTask";
import auth from "../middleware/auth";

const router = express.Router();

router.get("/", auth, ctrl.getAllTasks);
router.get("/task", auth, ctrl.getTask);
router.get("/stats", auth, ctrl.getStats);        // Move this BEFORE /:id
router.get("/:id", auth, ctrl.getTaskById);      // Dynamic route last
router.post("/", auth, validateCreateTask, ctrl.createTask);
router.put("/:id", auth, validateUpdateTask, ctrl.updateTask);
router.delete("/:id", auth, ctrl.deleteTask);

export default router;
