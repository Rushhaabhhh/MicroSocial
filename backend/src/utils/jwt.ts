import jwt from "jsonwebtoken";
import { config } from "../config/env";

export interface JWTPayload {
  id: string;
  email: string;
}

export const generateToken = (payload: JWTPayload) =>
  jwt.sign(payload, config.jwtSecret, { expiresIn: parseInt(config.jwtExpire, 10) });

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, config.jwtSecret) as JWTPayload;
  } catch {
    return null;
  }
};
