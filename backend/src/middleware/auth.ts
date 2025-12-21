import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { fail } from "../utils/errorResponse";

export interface AuthRequest extends Request {
  userId?: string;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return res.status(401).json(fail(401, "No token"));

  const token = header.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json(fail(401, "Invalid token"));

  req.userId = decoded.id;
  next();
};

export const authMiddleware = auth;

export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers.authorization;
    if (header?.startsWith("Bearer ")) {
      const token = header.split(" ")[1];
      const decoded = verifyToken(token);
      if (decoded) {
        req.userId = decoded.id;
      }
    }
    next();
  } catch (error) {
    next();
  }
};
