import { User } from "../models";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/auth";

export const authMutations = {
  register: async (
    _: any,
    {
      email,
      username,
      password,
      firstName,
      lastName,
    }: {
      email: string;
      username: string;
      password: string;
      firstName?: string;
      lastName?: string;
    }
  ) => {
    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const existingUsername = await User.findOne({
      where: { username },
    });

    if (existingUsername) {
      throw new Error("Username already taken");
    }

    // Create new user (password will be hashed automatically)
    const user = await User.create({
      email,
      username,
      password,
      firstName,
      lastName,
    });

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      accessToken,
      refreshToken,
    };
  },

  login: async (
    _: any,
    { email, password }: { email: string; password: string }
  ) => {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      accessToken,
      refreshToken,
    };
  },

  refreshToken: async (_: any, { refreshToken }: { refreshToken: string }) => {
    try {
      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Generate new access token
      const accessToken = generateAccessToken(decoded.userId);

      return {
        accessToken,
      };
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  },
};
