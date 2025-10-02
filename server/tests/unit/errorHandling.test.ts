import errorHandler from "../../src/middleware/errorHandling";

describe("Error Handler Middleware - Unit Tests", () => {
  it("should return error response", () => {
    const err = new Error("Something went wrong");
    const req: any = {};
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    errorHandler(err, req, res, next); // ✅ added next

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: null,
      message: "Something went wrong",
    });
  });

  it("should handle error with custom status", () => {
    const err: any = new Error("Not Found");
    err.status = 404;
    const req: any = {};
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    errorHandler(err, req, res, next); // ✅ added next

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: null,
      message: "Not Found",
    });
  });
});
