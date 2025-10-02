import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import taskRoutes from "../../src/routes/tasks";
import * as ctrl from "../../src/controllers/taskController";

// Mock auth middleware to just call `next()`
jest.mock("../../src/middleware/auth", () => 
  (req: Request, res: Response, next: NextFunction) => next()
);

// Mock validate middleware
jest.mock("../../src/middleware/validateTask", () => ({
  validateCreateTask: (req: Request, res: Response, next: NextFunction) => next(),
  validateUpdateTask: (req: Request, res: Response, next: NextFunction) => next(),
}));

// Mock controller functions
jest.mock("../../src/controllers/taskController", () => ({
  getAllTasks: jest.fn((req: Request, res: Response) => res.status(200).json({ message: "getAllTasks" })),
  getTask: jest.fn((req: Request, res: Response) => res.status(200).json({ message: "getTask" })),
  getTaskById: jest.fn((req: Request, res: Response) => res.status(200).json({ message: "getTaskById" })),
  createTask: jest.fn((req: Request, res: Response) => res.status(201).json({ message: "createTask" })),
  updateTask: jest.fn((req: Request, res: Response) => res.status(200).json({ message: "updateTask" })),
  deleteTask: jest.fn((req: Request, res: Response) => res.status(200).json({ message: "deleteTask" })),
  getStats: jest.fn((req: Request, res: Response) => res.status(200).json({ message: "getStats" })),
}));

const app = express();
app.use(express.json());
app.use("/api/tasks", taskRoutes);

describe("Task Routes", () => {
  it("GET /api/tasks should return getAllTasks", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("getAllTasks");
  });

  it("POST /api/tasks should create a task", async () => {
    const res = await request(app).post("/api/tasks").send({ title: "Test Task" });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("createTask");
  });

  it("GET /api/tasks/:id should return task by id", async () => {
    const res = await request(app).get("/api/tasks/123");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("getTaskById");
  });

  it("GET /api/tasks/task should return getTask", async () => {
    const res = await request(app).get("/api/tasks/task");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("getTask");
  });

  it("GET /api/tasks/stats should return getStats", async () => {
    const res = await request(app).get("/api/tasks/stats");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("getStats");
  });

  it("PUT /api/tasks/:id should update a task", async () => {
    const res = await request(app).put("/api/tasks/123").send({ title: "Updated Task" });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("updateTask");
  });

  it("DELETE /api/tasks/:id should delete a task", async () => {
    const res = await request(app).delete("/api/tasks/123");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("deleteTask");
  });
});
