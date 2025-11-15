import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { useExpressServer } from "routing-controllers";
import { sequelize, testConnection } from "./config/database";
import "./models"; // Import models to register them
import { AuthController } from "./controllers/auth.controller";
import {
  errorHandler,
  formatValidationErrors,
} from "./middlewares/error.middleware";
import { StatusCodes } from "http-status-codes";
import { Builder } from "builder-pattern";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Request size limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Setup routing-controllers
useExpressServer(app, {
  controllers: [AuthController],
  defaultErrorHandler: false, // Disable default to use custom handler
  validation: true, // Enable class-validator validation
  classTransformer: true, // Enable class-transformer
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handler middleware for routing-controllers validation errors
app.use((err: any, req: any, res: any, next: any) => {
  // Handle validation errors from routing-controllers
  if (
    err.name === "BadRequestError" &&
    err.errors &&
    Array.isArray(err.errors)
  ) {
    const formattedErrors = formatValidationErrors(err.errors);
    const message = formattedErrors.join(", ") || "Dữ liệu không hợp lệ";

    const response = Builder<any>().success(false).message(message).build();
    return res.status(StatusCodes.BAD_REQUEST).json(response);
  }

  // Pass to global error handler
  errorHandler(err, req, res, next);
});

// Global error handler
app.use(errorHandler);

// 404 handler (last)
app.use((req, res) => {
  // Check if response already sent
  if (res.headersSent) {
    return;
  }

  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Sync database models
    await sequelize.sync({ alter: false });
    console.log("✓ Database models synchronized");

    app.listen(PORT, () => {
      console.log(
        `✓ Server is running on http://localhost:${PORT} (${
          process.env.NODE_ENV || "development"
        })`
      );
    });
  } catch (error) {
    console.error("✗ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
