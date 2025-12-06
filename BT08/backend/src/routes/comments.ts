import { Router } from "express";
import { CommentController } from "../controllers/CommentController";

const router = Router();

// GET /api/comments?productId=:productId
router.get("/", CommentController.getComments);

// POST /api/comments
router.post("/", CommentController.addComment);

// PUT /api/comments/:id
router.put("/:id", CommentController.updateComment);

// DELETE /api/comments/:id
router.delete("/:id", CommentController.deleteComment);

export default router;
