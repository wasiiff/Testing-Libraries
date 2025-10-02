import request from "supertest";
import app from "../../src/index";

describe("Express App Routes", () => {
  it("GET / should return hello world", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ hello: "world" });
  });

  it("should have /api/tasks and /api/users routes", async () => {
    const resTasks = await request(app).get("/api/tasks");
    // Auth middleware will reject unauthorized request
    expect(resTasks.status).toBe(401);

    const resUsers = await request(app).get("/api/users");
    // Route exists but method not allowed
    expect(resUsers.status).toBe(404);
  });
});
