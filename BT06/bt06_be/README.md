# BT05 Backend - E-Commerce API

Backend API cho ứng dụng E-Commerce với đầy đủ tính năng bảo mật sử dụng **routing-controllers** và decorators.

## Architecture

- **routing-controllers**: Decorator-based routing như Spring Boot/NestJS
- **class-validator**: DTO validation với decorators
- **TypeScript**: Full type safety
- **Sequelize ORM**: MySQL database

## Features

### 4 Lớp Bảo Mật

1. **Input Validation** - class-validator (DTOs với decorators)
2. **Authentication** - JWT với middleware
3. **Authorization** - Role-based middleware (user/admin)
4. **Security Best Practices** - Password hashing, CORS, sanitization### API Endpoints

#### Authentication

- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `GET /api/auth/me` - Lấy thông tin user hiện tại
- `POST /api/auth/logout` - Đăng xuất

#### Products (Public read, Admin write)

- `GET /api/products` - Danh sách sản phẩm (có pagination & filters)
- `GET /api/products/:id` - Chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm [Admin]
- `PUT /api/products/:id` - Cập nhật sản phẩm [Admin]
- `DELETE /api/products/:id` - Xóa sản phẩm [Admin]

#### Categories (Public read, Admin write)

- `GET /api/categories` - Danh sách danh mục
- `GET /api/categories/:id` - Chi tiết danh mục
- `POST /api/categories` - Tạo danh mục [Admin]
- `PUT /api/categories/:id` - Cập nhật danh mục [Admin]
- `DELETE /api/categories/:id` - Xóa danh mục [Admin]

## Setup

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình .env

```
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bt05_db

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:5173
```

### 3. Tạo database

```sql
CREATE DATABASE bt05_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Seed data mẫu

```bash
npm run seed
```

Sẽ tạo:

- 2 users (admin, user)
- 4 categories
- 10 products

Test accounts:

- Admin: `admin@example.com` / `Admin@123`
- User: `user@example.com` / `User@123`

### 5. Chạy server

```bash
npm run dev
```

Server sẽ chạy tại: http://localhost:5000

## Testing

### Test Rate Limiting

```bash
# Gửi nhiều requests liên tiếp để test rate limiter
for i in {1..20}; do curl http://localhost:5000/api/products; done
```

### Test Product API

```bash
# Get products với filters
curl "http://localhost:5000/api/products?page=1&limit=10&categoryId=1"

# Create product (cần admin token)
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 1000000,
    "stock": 10,
    "categoryId": 1
  }'
```

## Project Structure

```
src/
├── config/           # Database config
├── constants/        # Constants & error messages
├── controllers/      # Controllers với @JsonController decorators
│   ├── auth.controller.ts
│   ├── product.controller.ts
│   └── category.controller.ts
├── dtos/            # DTOs với class-validator decorators
│   ├── auth.dto.ts
│   ├── product.dto.ts
│   └── category.dto.ts
├── middlewares/     # Auth & authorization middlewares
│   ├── auth.middleware.ts
│   ├── authorization.middleware.ts
│   └── error.middleware.ts
├── models/          # Sequelize models
│   ├── User.ts
│   ├── Product.ts
│   ├── Category.ts
│   └── index.ts
├── repositories/    # Database operations
├── scripts/         # Utility scripts (seed, etc.)
├── services/        # Business logic
├── types/           # TypeScript types
└── utils/           # Helper functions
```

## Key Features

### Decorator-based Controllers (routing-controllers)

Giống như Spring Boot hoặc NestJS:

```typescript
@JsonController("/api/products")
export class ProductController {
  @Get("/")
  async getProducts(@QueryParams() query: any) {}

  @Post("/")
  @UseBefore(authMiddleware, requireAdmin)
  async createProduct(@Body() body: CreateProductDto) {}
}
```

### DTO Validation với Decorators

```typescript
export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: "Tên sản phẩm không được để trống" })
  @Length(2, 255)
  name!: string;

  @IsNumber()
  @Min(0)
  price!: number;
}
```

## Tech Stack

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Sequelize** - MySQL ORM
- **express-validator** - Input validation
- **express-rate-limit** - Rate limiting
- **JWT** - Authentication
- **bcrypt** - Password hashing
