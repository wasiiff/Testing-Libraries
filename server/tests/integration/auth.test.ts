import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/index";
import User from "../../src/models/user"; // Import User model

jest.setTimeout(30000); // 30s for slow MongoDB/BCrypt

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI!);
  }
});

// Instead of dropping the whole DB, just clear users collection
beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth API", () => {
  it("should register a new user", async () => {
    const uniqueEmail = `test_${Date.now()}@example.com`;

    const res = await request(app)
      .post("/api/users/register")
      .send({
        name: "Test User",
        email: uniqueEmail,
        password: "password123",
      });

    console.log("📨 Register response:", res.status, res.body);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should fail login with wrong password", async () => {
    const uniqueEmail = `wrongpass_${Date.now()}@example.com`;

    // Register a fresh user first
    await request(app).post("/api/users/register").send({
      name: "Wrong Pass User",
      email: uniqueEmail,
      password: "password123",
    });

    // Try login with wrong password
    const res = await request(app).post("/api/users/login").send({
      email: uniqueEmail,
      password: "wrongpassword",
    });

    console.log("📨 Wrong login response:", res.status, res.body);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });
});
