import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || "access-secret";
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "refresh-secret";

export const generateAccessToken = (userId: number): string => {
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m", // 15 minutes
  });
};

export const generateRefreshToken = (userId: number): string => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d", // 7 days
  });
};

export const verifyAccessToken = (token: string): { userId: number } => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as { userId: number };
};

export const verifyRefreshToken = (token: string): { userId: number } => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as { userId: number };
};
