import { Response } from "express";
import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Res,
  UseBefore,
} from "routing-controllers";
import { StatusCodes } from "http-status-codes";
import { Builder } from "builder-pattern";
import { CategoryService } from "../services/category.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/authorization.middleware";
import { CreateCategoryDto, UpdateCategoryDto } from "../dtos/category.dto";

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

@JsonController("/api/categories")
export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  /**
   * Get all categories
   * GET /api/categories
   */
  @Get("/")
  async getAllCategories(@Res() res: Response): Promise<Response> {
    try {
      const categories = await this.categoryService.getAllCategories();

      const response = Builder<ApiResponse>()
        .success(true)
        .message("Lấy danh sách danh mục thành công")
        .data(categories)
        .build();

      return res.status(StatusCodes.OK).json(response);
    } catch (error: any) {
      const response = Builder<ApiResponse>()
        .success(false)
        .message("Lỗi khi lấy danh sách danh mục")
        .error(error.message)
        .build();
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
  }

  /**
   * Get category by ID
   * GET /api/categories/:id
   */
  @Get("/:id")
  async getCategoryById(
    @Param("id") id: string,
    @Res() res: Response
  ): Promise<Response> {
    try {
      const category = await this.categoryService.getCategoryById(parseInt(id));

      if (!category) {
        const response = Builder<ApiResponse>()
          .success(false)
          .message("Không tìm thấy danh mục")
          .build();
        return res.status(StatusCodes.NOT_FOUND).json(response);
      }

      const response = Builder<ApiResponse>()
        .success(true)
        .message("Lấy thông tin danh mục thành công")
        .data(category)
        .build();

      return res.status(StatusCodes.OK).json(response);
    } catch (error: any) {
      const response = Builder<ApiResponse>()
        .success(false)
        .message("Lỗi khi lấy thông tin danh mục")
        .error(error.message)
        .build();
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
  }

  /**
   * Create new category (Admin only)
   * POST /api/categories
   */
  @Post("/")
  @UseBefore(authMiddleware, requireAdmin)
  async createCategory(
    @Body() body: CreateCategoryDto,
    @Res() res: Response
  ): Promise<Response> {
    try {
      const { name, description, slug } = body;

      const category = await this.categoryService.createCategory({
        name,
        description,
        slug,
      });

      const response = Builder<ApiResponse>()
        .success(true)
        .message("Tạo danh mục thành công")
        .data(category)
        .build();

      return res.status(StatusCodes.CREATED).json(response);
    } catch (error: any) {
      if (error.message === "Slug đã tồn tại") {
        const response = Builder<ApiResponse>()
          .success(false)
          .message(error.message)
          .build();
        return res.status(StatusCodes.BAD_REQUEST).json(response);
      }

      const response = Builder<ApiResponse>()
        .success(false)
        .message("Lỗi khi tạo danh mục")
        .error(error.message)
        .build();
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
  }

  /**
   * Update category (Admin only)
   * PUT /api/categories/:id
   */
  @Put("/:id")
  @UseBefore(authMiddleware, requireAdmin)
  async updateCategory(
    @Param("id") id: string,
    @Body() body: UpdateCategoryDto,
    @Res() res: Response
  ): Promise<Response> {
    try {
      const { name, description, slug } = body;

      const category = await this.categoryService.updateCategory(parseInt(id), {
        name,
        description,
        slug,
      });

      const response = Builder<ApiResponse>()
        .success(true)
        .message("Cập nhật danh mục thành công")
        .data(category)
        .build();

      return res.status(StatusCodes.OK).json(response);
    } catch (error: any) {
      if (
        error.message === "Không tìm thấy danh mục" ||
        error.message === "Slug đã tồn tại"
      ) {
        const response = Builder<ApiResponse>()
          .success(false)
          .message(error.message)
          .build();
        return res.status(StatusCodes.BAD_REQUEST).json(response);
      }

      const response = Builder<ApiResponse>()
        .success(false)
        .message("Lỗi khi cập nhật danh mục")
        .error(error.message)
        .build();
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
  }

  /**
   * Delete category (Admin only)
   * DELETE /api/categories/:id
   */
  @Delete("/:id")
  @UseBefore(authMiddleware, requireAdmin)
  async deleteCategory(
    @Param("id") id: string,
    @Res() res: Response
  ): Promise<Response> {
    try {
      await this.categoryService.deleteCategory(parseInt(id));

      const response = Builder<ApiResponse>()
        .success(true)
        .message("Xóa danh mục thành công")
        .build();

      return res.status(StatusCodes.OK).json(response);
    } catch (error: any) {
      if (error.message === "Không tìm thấy danh mục") {
        const response = Builder<ApiResponse>()
          .success(false)
          .message(error.message)
          .build();
        return res.status(StatusCodes.NOT_FOUND).json(response);
      }

      const response = Builder<ApiResponse>()
        .success(false)
        .message("Lỗi khi xóa danh mục")
        .error(error.message)
        .build();
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
  }
}

export default CategoryController;
