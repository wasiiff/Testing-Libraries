import authMiddleware from "../../src/middleware/auth";
import jwt from "jsonwebtoken";
import User from "../../src/models/user";

jest.mock("jsonwebtoken");
jest.mock("../../src/models/user");

describe("Auth Middleware - Unit Tests", () => {
  it("should pass with valid token", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ id: "123" });
    (User.findById as jest.Mock).mockResolvedValue({ id: "123" });

    const req: any = {
      header: (name: string) => (name === "Authorization" ? "Bearer validtoken" : undefined),
    };
    const res: any = {};
    const next = jest.fn();

    await authMiddleware(req, res, next);

    expect(req.user).toBe("123");
    expect(next).toHaveBeenCalled();
  });

  it("should fail without token", async () => {
    const req: any = { header: () => undefined };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "No Token Found" });
  });
});
