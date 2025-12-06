import { Comment, User } from "../models";

export class CommentService {
  static async getProductComments(productId: number) {
    const comments = await Comment.findAll({
      where: { productId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "firstName", "lastName"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return comments;
  }

  static async addComment(data: {
    userId: number;
    productId: number;
    content: string;
    rating: number;
  }) {
    if (data.rating < 1 || data.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const comment = await Comment.create(data);

    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "firstName", "lastName"],
        },
      ],
    });

    return commentWithUser;
  }

  static async updateComment(
    id: number,
    data: { content?: string; rating?: number }
  ) {
    const comment = await Comment.findByPk(id);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
      throw new Error("Rating must be between 1 and 5");
    }

    if (data.content !== undefined) {
      comment.content = data.content;
    }
    if (data.rating !== undefined) {
      comment.rating = data.rating;
    }

    await comment.save();

    const updatedComment = await Comment.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "firstName", "lastName"],
        },
      ],
    });

    return updatedComment;
  }

  static async deleteComment(id: number) {
    const deleted = await Comment.destroy({
      where: { id },
    });

    return deleted > 0;
  }

  static async getCommentCount(productId: number): Promise<number> {
    return await Comment.count({ where: { productId } });
  }

  static async getAverageRating(productId: number): Promise<number | null> {
    const comments = await Comment.findAll({
      where: { productId },
      attributes: ["rating"],
    });

    if (comments.length === 0) return null;

    const sum = comments.reduce((acc, comment) => acc + comment.rating, 0);
    return sum / comments.length;
  }
}
