import { register, login } from "../../src/controllers/authController";
import User from "../../src/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../../src/models/user");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Auth Controller - Unit Tests", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "test_secret"; // ✅ prevent 500 from missing secret
  });

  beforeEach(() => jest.clearAllMocks());

  it("should register a new user", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_pw");
    (User.create as jest.Mock).mockResolvedValue({ _id: "123", email: "test@example.com" });
    (jwt.sign as jest.Mock).mockReturnValue("fake_token");

    const req: any = { body: { name: "Test", email: "test@example.com", password: "123456" } };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await register(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(bcrypt.hash).toHaveBeenCalledWith("123456", expect.anything()); // ✅ allow anything
    expect(User.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("should fail login with wrong password", async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ password: "hashed_pw" });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const req: any = { body: { email: "test@example.com", password: "wrong" } };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
  });

  it("should login successfully with correct password", async () => {
    (User.findOne as jest.Mock).mockResolvedValue({
      _id: "123",
      email: "test@example.com",
      password: "hashed_pw",
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("valid_token");

    const req: any = { body: { email: "test@example.com", password: "123456" } };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: "valid_token" }));
  });
});
