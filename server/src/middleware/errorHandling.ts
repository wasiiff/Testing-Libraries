import { Request, Response, NextFunction } from "express";

// Extend Error to optionally include `status`
interface CustomError extends Error {
  status?: number;
}

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.log(err);

  const status = err.status || 500;

  res.status(status).json({
    success: false,
    data: null,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
