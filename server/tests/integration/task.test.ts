jest.setTimeout(30000);

import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/index";

let token: string;

beforeAll(async () => {
  // Ensure connection is established
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI!);
  }

  // Clean database before starting
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }

  // Register a fresh test user
  await request(app).post("/api/users/register").send({
    name: "Task User",
    email: "task@example.com",
    password: "password123",
  });

  // Login that user to get token
  const res = await request(app).post("/api/users/login").send({
    email: "task@example.com",
    password: "password123",
  });

  token = res.body.token;
});

// Clean DB between tests (but keep users collection for auth)
beforeEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      if (collection.collectionName !== "users") {
        await collection.deleteMany({});
      }
    }
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Task API", () => {
  it("should create a new task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "My first task" });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("title", "My first task");
  });

  it("should fetch all tasks", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
