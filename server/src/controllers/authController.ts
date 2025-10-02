import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user";

// Helper to generate JWT token
const generateToken = (userId: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// REGISTER
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email Already Exist" });
      return;
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const user: IUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({ token });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken(user._id.toString());
    res.status(200).json({ token });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
