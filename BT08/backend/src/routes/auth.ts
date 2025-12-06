import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const router = Router();

// POST /api/auth/register
router.post("/register", AuthController.register);

// POST /api/auth/login
router.post("/login", AuthController.login);

// POST /api/auth/refresh
router.post("/refresh", AuthController.refreshToken);

// GET /api/auth/me
router.get("/me", AuthController.getCurrentUser);

export default router;
