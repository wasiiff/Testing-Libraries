import {
  createTask,
  getTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getStats,
} from "../../src/controllers/taskController";
import Task from "../../src/models/task";

jest.mock("../../src/models/task");

describe("Task Controller - Unit Tests", () => {
  let res: any;
  let next: any;

  beforeEach(() => {
    jest.clearAllMocks();
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  it("should create a task", async () => {
    (Task.create as jest.Mock).mockResolvedValue({
      title: "Test Task",
      user: "123",
      completed: false,
    });

    const req: any = { body: { title: "Test Task" }, user: "123" };

    await createTask(req, res, next);

    expect(Task.create).toHaveBeenCalledWith({
      title: "Test Task",
      completed: false,
      user: "123",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { title: "Test Task", user: "123", completed: false },
      message: "Task created successfully",
    });
  });

  it("should get tasks for user", async () => {
    (Task.find as jest.Mock).mockResolvedValue([{ title: "Task1" }]);

    const req: any = { user: "123", query: {} }; // Ensure query exists

    await getTask(req, res, next);

    expect(Task.find).toHaveBeenCalledWith({ user: "123" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: [{ title: "Task1" }],
      message: "Task(s) retrieved successfully",
    });
  });

  it("should get all tasks", async () => {
    (Task.find as jest.Mock).mockResolvedValue([{ title: "All Task" }]);

    const req: any = { user: "123" };

    await getAllTasks(req, res, next);

    expect(Task.find).toHaveBeenCalledWith({ user: "123" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: [{ title: "All Task" }],
      message: "Tasks retrieved successfully",
    });
  });

  it("should get task by id", async () => {
    (Task.findOne as jest.Mock).mockResolvedValue({ _id: "1", title: "One Task" });

    const req: any = { params: { id: "1" }, user: "123" };

    await getTaskById(req, res, next);

    expect(Task.findOne).toHaveBeenCalledWith({ _id: "1", user: "123" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { _id: "1", title: "One Task" },
      message: "Task retrieved successfully",
    });
  });

  it("should return 404 when task not found by id", async () => {
    (Task.findOne as jest.Mock).mockResolvedValue(null);

    const req: any = { params: { id: "1" }, user: "123" };

    await getTaskById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: null,
      message: "Task not found",
    });
  });

  it("should update task", async () => {
    (Task.findOneAndUpdate as jest.Mock).mockResolvedValue({ title: "Updated Task" });

    const req: any = { params: { id: "1" }, body: { title: "Updated Task" }, user: "123" };

    await updateTask(req, res, next);

    expect(Task.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "1", user: "123" },
      { title: "Updated Task", completed: undefined },
      { new: true, runValidators: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { title: "Updated Task" },
      message: "Task updated successfully",
    });
  });

  it("should delete task", async () => {
    (Task.findOneAndDelete as jest.Mock).mockResolvedValue({ _id: "1" });

    const req: any = { params: { id: "1" }, user: "123" };

    await deleteTask(req, res, next);

    expect(Task.findOneAndDelete).toHaveBeenCalledWith({ _id: "1", user: "123" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { _id: "1" },
      message: "Task deleted successfully",
    });
  });

  it("should return task stats", async () => {
    (Task.countDocuments as jest.Mock)
      .mockResolvedValueOnce(5) // total
      .mockResolvedValueOnce(2); // completed

    const req: any = { user: "123" };

    await getStats(req, res, next);

    expect(Task.countDocuments).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { total: 5, completed: 2, pending: 3 },
      message: "Stats retrieved successfully",
    });
  });
});
