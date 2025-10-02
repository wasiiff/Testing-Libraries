import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import taskRouter from "./routes/tasks";
import authRouter from "./routes/authRoutes";
import errorHandler from "./middleware/errorHandling";
import connectDB from "./config/db";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Connect to DB once
connectDB();

// Test route
app.get("/", (_req: Request, res: Response) => {
  return res.json({ hello: "world" });
});

// Routes
app.use("/api/users", authRouter);
app.use("/api/tasks", taskRouter);

// Error handler
app.use(errorHandler);

// Start server only outside test env
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

export default app;
