import { Response } from "express";
import {
  JsonController,
  Post,
  Body,
  Get,
  UseBefore,
  Res,
  Req,
} from "routing-controllers";
import { StatusCodes } from "http-status-codes";
import { Builder } from "builder-pattern";
import { AuthenticatedRequest } from "../types/express";
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "../dtos/auth.dto";
import { AuthService } from "../services/auth.service";
import {
  generateToken,
  generateResetToken,
  verifyResetToken,
} from "../utils/jwt";
import { sendResetPasswordEmail, sendWelcomeEmail } from "../utils/email";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants/validation";
import { sanitizeEmail } from "../utils/sanitizer";
import { authMiddleware } from "../middlewares/auth.middleware";

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: any;
  error?: string;
}

@JsonController("/api/auth")
export class AuthController {
  /**
   * Register new user
   */
  @Post("/register")
  async register(
    @Body() body: RegisterDto,
    @Res() res: Response
  ): Promise<Response> {
    try {
      const { email, password, fullName } = body;

      const user = await AuthService.register({
        email,
        password,
        confirmPassword: password,
        fullName,
      });

      // Send welcome email (non-blocking)
      sendWelcomeEmail(email, fullName).catch((error) => {
        console.error("Error sending welcome email:", error);
      });

      const token = generateToken(user.id!, email);

      const response = Builder<ApiResponse>()
        .success(true)
        .message(SUCCESS_MESSAGES.REGISTER_SUCCESS)
        .token(token)
        .user({
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        })
        .build();

      return res.status(StatusCodes.CREATED).json(response);
    } catch (error: any) {
      console.error("Register error:", error);
      const response = Builder<ApiResponse>()
        .success(false)
        .message(error.message || ERROR_MESSAGES.INTERNAL_ERROR)
        .build();
      return res.status(StatusCodes.BAD_REQUEST).json(response);
    }
  }

  /**
   * Login user
   */
  @Post("/login")
  async login(@Body() body: LoginDto, @Res() res: Response): Promise<Response> {
    try {
      const { email, password } = body;

      const user = await AuthService.login({ email, password });
      const token = generateToken(user.id!, email);

      const response = Builder<ApiResponse>()
        .success(true)
        .message(SUCCESS_MESSAGES.LOGIN_SUCCESS)
        .token(token)
        .user({
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        })
        .build();

      return res.status(StatusCodes.OK).json(response);
    } catch (error: any) {
      const response = Builder<ApiResponse>()
        .success(false)
        .message(error.message || ERROR_MESSAGES.INVALID_CREDENTIALS)
        .build();
      return res.status(StatusCodes.UNAUTHORIZED).json(response);
    }
  }

  /**
   * Forgot password - Update password directly with email
   */
  @Post("/forgot-password")
  async forgotPassword(
    @Body() body: ForgotPasswordDto,
    @Res() res: Response
  ): Promise<Response> {
    try {
      const { email, password } = body;

      const sanitizedEmail = sanitizeEmail(email);
      const user = await AuthService.findUserByEmail(sanitizedEmail);

      if (!user) {
        const response = Builder<ApiResponse>()
          .success(false)
          .message(ERROR_MESSAGES.USER_NOT_FOUND)
          .build();
        return res.status(StatusCodes.NOT_FOUND).json(response);
      }

      // Update password directly
      await AuthService.updatePasswordByEmail(sanitizedEmail, password);

      const response = Builder<ApiResponse>()
        .success(true)
        .message(SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS)
        .build();

      return res.status(StatusCodes.OK).json(response);
    } catch (error: any) {
      const response = Builder<ApiResponse>()
        .success(false)
        .message(ERROR_MESSAGES.INTERNAL_ERROR)
        .error(error.message)
        .build();
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
  }

  /**
   * Reset password
   */
  @Post("/reset-password")
  async resetPassword(
    @Body() body: ResetPasswordDto,
    @Res() res: Response
  ): Promise<Response> {
    try {
      const { token, password } = body;

      const email = verifyResetToken(token);
      if (!email) {
        const response = Builder<ApiResponse>()
          .success(false)
          .message(ERROR_MESSAGES.INVALID_TOKEN)
          .build();
        return res.status(StatusCodes.BAD_REQUEST).json(response);
      }

      await AuthService.updatePasswordByEmail(email, password);

      const response = Builder<ApiResponse>()
        .success(true)
        .message(SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS)
        .build();

      return res.status(StatusCodes.OK).json(response);
    } catch (error: any) {
      const response = Builder<ApiResponse>()
        .success(false)
        .message(error.message || ERROR_MESSAGES.INTERNAL_ERROR)
        .build();
      return res.status(StatusCodes.BAD_REQUEST).json(response);
    }
  }

  /**
   * Get current user info
   */
  @Get("/current-user")
  @UseBefore(authMiddleware)
  async getCurrentUser(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response
  ): Promise<Response> {
    try {
      if (!req.user?.id) {
        const response = Builder<ApiResponse>()
          .success(false)
          .message(ERROR_MESSAGES.UNAUTHORIZED)
          .build();
        return res.status(StatusCodes.UNAUTHORIZED).json(response);
      }

      const user = await AuthService.findUserById(req.user.id);
      if (!user) {
        const response = Builder<ApiResponse>()
          .success(false)
          .message(ERROR_MESSAGES.USER_NOT_FOUND)
          .build();
        return res.status(StatusCodes.NOT_FOUND).json(response);
      }

      const response = Builder<ApiResponse>()
        .success(true)
        .data({ user })
        .build();

      return res.status(StatusCodes.OK).json(response);
    } catch (error: any) {
      console.error("Get current user error:", error);
      const response = Builder<ApiResponse>()
        .success(false)
        .message(ERROR_MESSAGES.INTERNAL_ERROR)
        .error(error.message)
        .build();
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
  }

  /**
   * Logout user
   */
  @Post("/logout")
  @UseBefore(authMiddleware)
  async logout(
    @Req() req: AuthenticatedRequest,
    @Res() res: Response
  ): Promise<Response> {
    try {
      const response = Builder<ApiResponse>()
        .success(true)
        .message(SUCCESS_MESSAGES.LOGOUT_SUCCESS)
        .build();

      return res.status(StatusCodes.OK).json(response);
    } catch (error: any) {
      console.error("Logout error:", error);
      const response = Builder<ApiResponse>()
        .success(false)
        .message(ERROR_MESSAGES.INTERNAL_ERROR)
        .error(error.message)
        .build();
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
  }
}
