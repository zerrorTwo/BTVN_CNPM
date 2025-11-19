import { Response } from "express";
import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Param,
  QueryParams,
  Body,
  Res,
  UseBefore,
} from "routing-controllers";
import { StatusCodes } from "http-status-codes";
import { Builder } from "builder-pattern";
import { ProductService } from "../services/product.service";
import { ProductFilters } from "../repositories/ProductRepository";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/authorization.middleware";
import { CreateProductDto, UpdateProductDto } from "../dtos/product.dto";

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: any;
  error?: string;
}

@JsonController("/api/products")
export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  /**
   * Get all products with pagination and filters
   * GET /api/products?page=1&limit=10&categoryId=1&search=phone&minPrice=100&maxPrice=1000
   */
  @Get("/")
  async getProducts(
    @QueryParams() query: any,
    @Res() res: Response
  ): Promise<Response> {
    try {
      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 10;

      const filters: ProductFilters = {
        categoryId: query.categoryId ? parseInt(query.categoryId) : undefined,
        search: query.search,
        minPrice: query.minPrice ? parseFloat(query.minPrice) : undefined,
        maxPrice: query.maxPrice ? parseFloat(query.maxPrice) : undefined,
      };

      const result = await this.productService.getProducts(filters, {
        page,
        limit,
      });

      const response = Builder<ApiResponse>()
        .success(true)
        .message("Lấy danh sách sản phẩm thành công")
        .data(result.products)
        .pagination(result.pagination)
        .build();

      return res.status(StatusCodes.OK).json(response);
    } catch (error: any) {
      const response = Builder<ApiResponse>()
        .success(false)
        .message("Lỗi khi lấy danh sách sản phẩm")
        .error(error.message)
        .build();
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
  }

  /**
   * Get product by ID
   * GET /api/products/:id
   */
  @Get("/:id")
  async getProductById(
    @Param("id") id: string,
    @Res() res: Response
  ): Promise<Response> {
    try {
      const product = await this.productService.getProductById(parseInt(id));

      if (!product) {
        const response = Builder<ApiResponse>()
          .success(false)
          .message("Không tìm thấy sản phẩm")
          .build();
        return res.status(StatusCodes.NOT_FOUND).json(response);
      }

      const response = Builder<ApiResponse>()
        .success(true)
        .message("Lấy thông tin sản phẩm thành công")
        .data(product)
        .build();

      return res.status(StatusCodes.OK).json(response);
    } catch (error: any) {
      const response = Builder<ApiResponse>()
        .success(false)
        .message("Lỗi khi lấy thông tin sản phẩm")
        .error(error.message)
        .build();
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
  }

  /**
   * Create new product (Admin only)
   * POST /api/products
   */
  @Post("/")
  @UseBefore(authMiddleware, requireAdmin)
  async createProduct(
    @Body() body: CreateProductDto,
    @Res() res: Response
  ): Promise<Response> {
    try {
      const { name, description, price, stock, imageUrl, categoryId } = body;

      const product = await this.productService.createProduct({
        name,
        description,
        price: parseFloat(price as any),
        stock: parseInt(stock as any),
        imageUrl,
        categoryId: parseInt(categoryId as any),
      });

      const response = Builder<ApiResponse>()
        .success(true)
        .message("Tạo sản phẩm thành công")
        .data(product)
        .build();

      return res.status(StatusCodes.CREATED).json(response);
    } catch (error: any) {
      if (error.message === "Không tìm thấy danh mục") {
        const response = Builder<ApiResponse>()
          .success(false)
          .message(error.message)
          .build();
        return res.status(StatusCodes.BAD_REQUEST).json(response);
      }

      const response = Builder<ApiResponse>()
        .success(false)
        .message("Lỗi khi tạo sản phẩm")
        .error(error.message)
        .build();
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
  }

  /**
   * Update product (Admin only)
   * PUT /api/products/:id
   */
  @Put("/:id")
  @UseBefore(authMiddleware, requireAdmin)
  async updateProduct(
    @Param("id") id: string,
    @Body() body: UpdateProductDto,
    @Res() res: Response
  ): Promise<Response> {
    try {
      const { name, description, price, stock, imageUrl, categoryId } = body;

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = parseFloat(price as any);
      if (stock !== undefined) updateData.stock = parseInt(stock as any);
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
      if (categoryId !== undefined)
        updateData.categoryId = parseInt(categoryId as any);

      const product = await this.productService.updateProduct(
        parseInt(id),
        updateData
      );

      const response = Builder<ApiResponse>()
        .success(true)
        .message("Cập nhật sản phẩm thành công")
        .data(product)
        .build();

      return res.status(StatusCodes.OK).json(response);
    } catch (error: any) {
      if (
        error.message === "Không tìm thấy sản phẩm" ||
        error.message === "Không tìm thấy danh mục"
      ) {
        const response = Builder<ApiResponse>()
          .success(false)
          .message(error.message)
          .build();
        return res.status(StatusCodes.BAD_REQUEST).json(response);
      }

      const response = Builder<ApiResponse>()
        .success(false)
        .message("Lỗi khi cập nhật sản phẩm")
        .error(error.message)
        .build();
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
  }

  /**
   * Delete product (Admin only)
   * DELETE /api/products/:id
   */
  @Delete("/:id")
  @UseBefore(authMiddleware, requireAdmin)
  async deleteProduct(
    @Param("id") id: string,
    @Res() res: Response
  ): Promise<Response> {
    try {
      await this.productService.deleteProduct(parseInt(id));

      const response = Builder<ApiResponse>()
        .success(true)
        .message("Xóa sản phẩm thành công")
        .build();

      return res.status(StatusCodes.OK).json(response);
    } catch (error: any) {
      if (error.message === "Không tìm thấy sản phẩm") {
        const response = Builder<ApiResponse>()
          .success(false)
          .message(error.message)
          .build();
        return res.status(StatusCodes.NOT_FOUND).json(response);
      }

      const response = Builder<ApiResponse>()
        .success(false)
        .message("Lỗi khi xóa sản phẩm")
        .error(error.message)
        .build();
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
  }
}

export default ProductController;
