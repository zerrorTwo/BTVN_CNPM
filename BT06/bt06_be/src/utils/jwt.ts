import jwt from "jsonwebtoken";
import { DecodedToken } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

export const generateToken = (
  userId: number,
  email: string,
  role: string = "user"
): string => {
  return jwt.sign({ id: userId, email, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): DecodedToken | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (error) {
    return null;
  }
};

export const generateResetToken = (email: string): string => {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
};

export const verifyResetToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    return decoded.email;
  } catch (error) {
    return null;
  }
};
