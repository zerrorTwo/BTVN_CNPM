import UserRepository from "../repositories/UserRepository";
import { User, RegisterRequest, AuthRequest } from "../types";
import { hashPassword, comparePassword } from "../utils/password";
import { sanitizeEmail, sanitizeFullName } from "../utils/sanitizer";
import { ERROR_MESSAGES } from "../constants/validation";

export class AuthService {
  /**
   * Register new user
   */
  static async register(data: RegisterRequest): Promise<User> {
    try {
      const { email, password, fullName } = data;

      // Validate inputs
      if (!email || !password || !fullName) {
        throw new Error("Thông tin không được để trống");
      }

      // Sanitize inputs
      const sanitizedEmail = sanitizeEmail(email);
      const sanitizedFullName = sanitizeFullName(fullName);

      // Check if user already exists
      const existingUser = await UserRepository.findByEmail(sanitizedEmail);
      if (existingUser) {
        throw new Error(ERROR_MESSAGES.USER_EXISTS);
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await UserRepository.create({
        email: sanitizedEmail,
        password: hashedPassword,
        fullName: sanitizedFullName,
      });

      if (!user) {
        throw new Error(ERROR_MESSAGES.DATABASE_ERROR);
      }

      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      } as User;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login user
   */
  static async login(data: AuthRequest): Promise<User> {
    try {
      const { email, password } = data;

      // Validate inputs
      if (!email || !password) {
        throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      // Sanitize email
      const sanitizedEmail = sanitizeEmail(email);

      // Find user with password
      const user = await UserRepository.findByEmailWithPassword(sanitizedEmail);
      if (!user) {
        throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      } as User;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find user by ID
   */
  static async findUserById(id: number): Promise<User | null> {
    try {
      if (!id || id <= 0) {
        return null;
      }

      const user = await UserRepository.findById(id);
      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      } as User;
    } catch (error) {
      console.error("Error finding user by ID:", error);
      return null;
    }
  }

  /**
   * Find user by email
   */
  static async findUserByEmail(email: string): Promise<User | null> {
    try {
      if (!email) {
        return null;
      }

      const sanitizedEmail = sanitizeEmail(email);
      const user = await UserRepository.findByEmail(sanitizedEmail);
      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      } as User;
    } catch (error) {
      console.error("Error finding user by email:", error);
      return null;
    }
  }

  /**
   * Update user password
   */
  static async updatePassword(
    userId: number,
    newPassword: string
  ): Promise<void> {
    try {
      if (!userId || userId <= 0) {
        throw new Error("Invalid user ID");
      }

      if (!newPassword) {
        throw new Error("Mật khẩu không được để trống");
      }

      const user = await UserRepository.findByIdWithPassword(userId);
      if (!user) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      const hashedPassword = await hashPassword(newPassword);
      await UserRepository.updatePassword(userId, hashedPassword);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update password by email
   */
  static async updatePasswordByEmail(
    email: string,
    newPassword: string
  ): Promise<void> {
    try {
      if (!email) {
        throw new Error(ERROR_MESSAGES.INVALID_EMAIL);
      }

      if (!newPassword) {
        throw new Error("Mật khẩu không được để trống");
      }

      const sanitizedEmail = sanitizeEmail(email);
      const user = await UserRepository.findByEmail(sanitizedEmail);
      if (!user) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      const hashedPassword = await hashPassword(newPassword);
      await UserRepository.updatePassword(user.id, hashedPassword);
    } catch (error) {
      throw error;
    }
  }
}
