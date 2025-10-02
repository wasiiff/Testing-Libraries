import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

// Extend Request to include `user` property
interface AuthRequest extends Request {
  user?: Types.ObjectId | string; // Depending on how you store user id
}

interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      message: "No Token Found",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({
      message: "Invalid Token",
    });
  }
};

export default authMiddleware;
