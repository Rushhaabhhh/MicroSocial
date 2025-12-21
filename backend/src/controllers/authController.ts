import { Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";
import { generateToken } from "../utils/jwt";
import { fail, ok } from "../utils/errorResponse";

export const register = async (req: AuthRequest, res: Response) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json(fail(400, "All fields required"));

  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) return res.status(400).json(fail(400, "User already exists"));

  const user = await User.create({ username, email, password });
  const token = generateToken({ id: user.id, email: user.email });

  res.status(201).json(
    ok({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio
      }
    }, "Registered")
  );
};

export const login = async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json(fail(400, "Email & password required"));

  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(401).json(fail(401, "Invalid credentials"));

  const match = await user.matchPassword(password);
  if (!match) return res.status(401).json(fail(401, "Invalid credentials"));

  const token = generateToken({ id: user.id, email: user.email });
  res.json(
    ok({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio
      }
    }, "Logged in")
  );
};

export const me = async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json(fail(404, "User not found"));

  res.json(
    ok({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio
    }, "Current user")
  );
};
