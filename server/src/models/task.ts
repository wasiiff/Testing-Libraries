import mongoose, { Document, Schema, Model, Types } from "mongoose";

// 1️⃣ Define TypeScript interface for a Task document
export interface ITask extends Document {
  title: string;
  completed: boolean;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// 2️⃣ Define the Mongoose schema
const taskSchema: Schema<ITask> = new Schema(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// 3️⃣ Export the model
const Task: Model<ITask> = mongoose.model<ITask>("Task", taskSchema);
export default Task;
