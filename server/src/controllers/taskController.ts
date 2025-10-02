import { Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/task";
import { Types } from "mongoose";

// Extend Request to include `user` property
interface AuthRequest extends Request {
  user?: Types.ObjectId; // Assuming you attach `req.user` as ObjectId
}

// GET ALL TASKS
export const getAllTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tasks = await Task.find({ user: req.user });
    res.status(200).json({
      success: true,
      data: tasks,
      message: "Tasks retrieved successfully",
    });
  } catch (err) {
    next(err);
  }
};

// GET TASKS WITH FILTER
export const getTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title } = req.query as { title?: string };
    let query: any = { user: req.user };
    if (title) {
      query.title = { $regex: title, $options: "i" };
    }
    const tasks = await Task.find(query);
    res.status(200).json({
      success: true,
      data: tasks,
      message: "Task(s) retrieved successfully",
    });
  } catch (err) {
    next(err);
  }
};

// GET TASK BY ID
export const getTaskById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user });
    if (!task) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Task not found",
      });
    }
    res.status(200).json({
      success: true,
      data: task,
      message: "Task retrieved successfully",
    });
  } catch (err) {
    next(err);
  }
};

// CREATE TASK
export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, completed = false } = req.body as { title: string; completed?: boolean };
    const task: ITask = await Task.create({ title, completed, user: req.user });
    res.status(201).json({
      success: true,
      data: task,
      message: "Task created successfully",
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE TASK
export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, completed } = req.body as { title?: string; completed?: boolean };
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { title, completed },
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Task not found or not authorized",
      });
    }
    res.status(200).json({
      success: true,
      data: task,
      message: "Task updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

// DELETE TASK
export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!task) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Task not found or not authorized",
      });
    }
    res.status(200).json({
      success: true,
      data: task,
      message: "Task deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// GET TASK STATS
export const getStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const total = await Task.countDocuments({ user: req.user });
    const completed = await Task.countDocuments({ user: req.user, completed: true });
    res.status(200).json({
      success: true,
      data: { total, completed, pending: total - completed },
      message: "Stats retrieved successfully",
    });
  } catch (err) {
    next(err);
  }
};
