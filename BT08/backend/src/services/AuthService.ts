import { User } from "../models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your-refresh-secret";

export class AuthService {
  static async register(data: {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) {
    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      ...data,
      password: hashedPassword,
    });

    return {
      user: this.sanitizeUser(user),
      tokens: this.generateTokens(user.id, user.email),
    };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    return {
      user: this.sanitizeUser(user),
      tokens: this.generateTokens(user.id, user.email),
    };
  }

  static generateTokens(userId: number, email: string) {
    const accessToken = jwt.sign({ userId, email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    return { accessToken, refreshToken };
  }

  static verifyAccessToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
  }

  static verifyRefreshToken(token: string) {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  }

  static sanitizeUser(user: any) {
    const userData = user.toJSON ? user.toJSON() : user;
    const { password, ...safeUser } = userData;
    return safeUser;
  }
}
