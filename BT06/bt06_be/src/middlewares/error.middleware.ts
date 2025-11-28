import { StatusCodes } from "http-status-codes";
import { Builder } from "builder-pattern";

interface ApiResponse {
  success: boolean;
  message: string;
  error?: string;
  errors?: any;
}

/**
 * Global error handler middleware
 */

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: any[]
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Format validation errors from routing-controllers
export const formatValidationErrors = (errors: any[] = []) => {
  return errors.map((error: any) => {
    const constraints = error.constraints || {};
    return Object.values(constraints).join(", ");
  });
};

export const errorHandler = (err: any, req: any, res: any, next: any) => {
  console.error("Error:", err);

  // Prevent multiple response sends
  if (res.headersSent) {
    return next(err);
  }

  // Handle validation errors from routing-controllers (BadRequestError)
  if (
    err.name === "BadRequestError" &&
    err.errors &&
    Array.isArray(err.errors)
  ) {
    const formattedErrors = formatValidationErrors(err.errors);
    const message = formattedErrors.join(", ") || "Dữ liệu không hợp lệ";

    const response = Builder<ApiResponse>()
      .success(false)
      .message(message)
      .build();

    return res.status(StatusCodes.BAD_REQUEST).json(response);
  }

  // Handle validation errors from routing-controllers (old format)
  if (
    err.statusCode === 400 &&
    err.message === "Invalid body, check 'errors' property for more info."
  ) {
    const validationErrors = err.errors || [];
    const formattedErrors = formatValidationErrors(validationErrors);
    const message = formattedErrors.join(", ") || "Dữ liệu không hợp lệ";

    const response = Builder<ApiResponse>()
      .success(false)
      .message(message)
      .build();

    return res.status(StatusCodes.BAD_REQUEST).json(response);
  }

  if (err instanceof ApiError) {
    const response = Builder<ApiResponse>()
      .success(false)
      .message(err.message)
      .error(err.errors?.join(", "))
      .build();

    return res.status(err.statusCode).json(response);
  }

  // Default error
  const response = Builder<ApiResponse>()
    .success(false)
    .message("Lỗi máy chủ nội bộ")
    .error(err.message)
    .build();

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
};
