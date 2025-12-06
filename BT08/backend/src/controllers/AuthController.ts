import { Request, Response } from "express";
import { User } from "../models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your-refresh-secret";

export class AuthController {
  // POST /api/auth/register
  static async register(req: Request, res: Response) {
    try {
      const { email, username, password, firstName, lastName } = req.body;

      if (!email || !username || !password) {
        return res
          .status(400)
          .json({ error: "email, username, and password are required" });
      }

      const existingUser = await User.findOne({
        where: { email },
      });

      if (existingUser) {
        return res
          .status(409)
          .json({ error: "User with this email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
      });

      const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, {
        expiresIn: "7d",
      });

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        accessToken,
        refreshToken,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/auth/login
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "email and password are required" });
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, {
        expiresIn: "7d",
      });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        accessToken,
        refreshToken,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/auth/refresh
  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ error: "refreshToken is required" });
      }

      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;

      const accessToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ accessToken });
    } catch (error: any) {
      res.status(401).json({ error: "Invalid refresh token" });
    }
  }

  // GET /api/auth/me
  static async getCurrentUser(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ error: "No authorization header" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      const user = await User.findByPk(decoded.userId, {
        attributes: ["id", "email", "username", "firstName", "lastName"],
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error: any) {
      res.status(401).json({ error: "Invalid token" });
    }
  }
}
