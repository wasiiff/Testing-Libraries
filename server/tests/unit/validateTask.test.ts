import { validateCreateTask } from "../../src/middleware/validateTask";

describe("Validate Task Middleware - Unit Tests", () => {
  it("should fail if title is missing", async () => {
    const req: any = { body: {} };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    // Call the middleware chain
    for (const middleware of validateCreateTask) {
      await middleware(req, res, next);
    }

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should call next on valid input", async () => {
    const req: any = { body: { title: "Valid Task" } };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    for (const middleware of validateCreateTask) {
      await middleware(req, res, next);
    }

    expect(next).toHaveBeenCalled();
  });
});
