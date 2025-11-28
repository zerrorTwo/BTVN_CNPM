import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "../types/express";

/**
 * Middleware to check if user has required role
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Vui lòng đăng nhập để tiếp tục",
      });
    }

    // Check if user has required role
    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "Bạn không có quyền truy cập tài nguyên này",
      });
    }

    next();
  };
};

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Check if user is authenticated
  if (!req.user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Vui lòng đăng nhập để tiếp tục",
    });
  }

  // Check if user is admin
  if (req.user.role !== "admin") {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message:
        "Bạn không có quyền truy cập tài nguyên này. Chỉ admin mới có quyền.",
    });
  }

  next();
};

/**
 * Middleware to check if user is authenticated (any role)
 */
export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Vui lòng đăng nhập để tiếp tục",
    });
  }

  next();
};
