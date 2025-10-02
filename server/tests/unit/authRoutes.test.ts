import request from "supertest";
import express from "express";
import authRoutes from "../../src/routes/authRoutes";
import * as ctrl from "../../src/controllers/authController";

// Mock controller functions
jest.mock("../../src/controllers/authController", () => ({
  register: jest.fn((req, res) => res.status(201).json({ message: "register" })),
  login: jest.fn((req, res) => res.status(200).json({ message: "login" })),
}));

const app = express();
app.use(express.json());
app.use("/api/users", authRoutes);

describe("Auth Routes", () => {
  it("POST /api/users/register should register user", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({ name: "Test", email: "test@example.com", password: "123456" });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("register");
  });

  it("POST /api/users/login should login user", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: "test@example.com", password: "123456" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("login");
  });
});
