import mongoose from "mongoose";
import connectDB, { _resetIsConnected } from "../../src/config/db";

jest.mock("mongoose");

describe("DB Connection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    _resetIsConnected(); // reset connection state before each test
    process.env.MONGO = "mongodb://localhost:27017/test";
  });

  it("should connect to MongoDB if not connected", async () => {
    (mongoose.connect as jest.Mock).mockResolvedValue({
      connections: [{ readyState: 1 }],
    });

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGO, {});
  });

  it("should not connect if already connected", async () => {
    (mongoose.connect as jest.Mock).mockResolvedValue({
      connections: [{ readyState: 1 }],
    });

    await connectDB(); // first call
    await connectDB(); // second call, should return early

    // Only called once because second call returns early
    expect(mongoose.connect).toHaveBeenCalledTimes(1);
  });

  it("should throw error if MONGO not defined", async () => {
    _resetIsConnected(); // make sure connection state is false
    delete process.env.MONGO;

    await expect(connectDB()).rejects.toThrow(
      "❌ MONGO connection string is not defined in .env"
    );
  });
});
