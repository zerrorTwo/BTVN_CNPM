import { Request, Response } from "express";
import { CommentService } from "../services";

export class CommentController {
  // GET /api/comments?productId=:productId
  static async getComments(req: Request, res: Response) {
    try {
      const { productId } = req.query;

      if (!productId) {
        return res.status(400).json({ error: "productId is required" });
      }

      const comments = await CommentService.getProductComments(
        parseInt(productId as string)
      );
      res.json(comments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/comments
  static async addComment(req: Request, res: Response) {
    try {
      const { userId, productId, content, rating } = req.body;

      if (!userId || !productId || !content || !rating) {
        return res.status(400).json({
          error: "userId, productId, content, and rating are required",
        });
      }

      const comment = await CommentService.addComment({
        userId,
        productId,
        content,
        rating,
      });

      res.status(201).json(comment);
    } catch (error: any) {
      if (error.message.includes("Rating must be")) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // PUT /api/comments/:id
  static async updateComment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { content, rating } = req.body;

      const updatedComment = await CommentService.updateComment(parseInt(id), {
        content,
        rating,
      });

      res.json(updatedComment);
    } catch (error: any) {
      if (error.message === "Comment not found") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes("Rating must be")) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  // DELETE /api/comments/:id
  static async deleteComment(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deleted = await CommentService.deleteComment(parseInt(id));

      if (deleted) {
        res.json({ success: true, message: "Comment deleted" });
      } else {
        res.status(404).json({ error: "Comment not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
