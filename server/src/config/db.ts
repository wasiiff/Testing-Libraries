import mongoose from "mongoose";

let isConnected = false; // Track connection state

export const _resetIsConnected = () => {
  isConnected = false; // helper for tests
};

const connectDB = async (): Promise<void> => {
  if (isConnected) return;

  try {
    if (!process.env.MONGO) {
      throw new Error("❌ MONGO connection string is not defined in .env");
    }

    const conn = await mongoose.connect(process.env.MONGO, {
      // Options not needed in modern mongoose
    });

    isConnected = conn.connections[0].readyState === 1; // 1 = connected
    console.log("✅ MongoDB Connected");
  } catch (err: any) {
    console.error("❌ MongoDB connection failed:", err.message);
    throw err;
  }
};

export default connectDB;
