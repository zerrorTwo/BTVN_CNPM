# 🔐 Auth Backend - MERN Stack

Express.js + TypeScript + Sequelize ORM + MySQL + routing-controllers

## 📋 Quick Setup

### 1. Database

```bash
mysql -u root -p
CREATE DATABASE mern_auth_db;
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  fullName VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. Environment Variables (.env)

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mern_auth_db
PORT=5000
JWT_SECRET=your_secret_key
```

### 3. Install & Run

```bash
npm install
npm run dev
```

## 🚀 API Endpoints

| Method | Endpoint                    | Description                  |
| ------ | --------------------------- | ---------------------------- |
| POST   | `/api/auth/register`        | Register new user            |
| POST   | `/api/auth/login`           | Login user                   |
| POST   | `/api/auth/forgot-password` | Request password reset       |
| POST   | `/api/auth/reset-password`  | Reset password with token    |
| GET    | `/api/auth/current-user`    | Get current user (protected) |
| POST   | `/api/auth/logout`          | Logout user                  |

## 🔐 Password Requirements

- Minimum 8 characters
- At least 1 uppercase, 1 lowercase, 1 number, 1 special char

## 📁 Project Structure

```
src/
├── config/
│   ├── database.ts          # Sequelize instance & connection
│   └── sequelize.config.ts  # Database configuration
├── constants/
│   └── validation.ts        # Validation rules & messages
├── controllers/
│   └── auth.controller.ts   # API endpoint handlers (routing-controllers)
├── dtos/
│   └── auth.dto.ts          # Data Transfer Objects with class-validator
├── middlewares/
│   ├── auth.middleware.ts   # JWT authentication
│   └── error.middleware.ts  # Global error handler
├── models/
│   ├── index.ts             # Models export
│   └── User.ts              # User model
├── repositories/
│   ├── index.ts
│   └── UserRepository.ts    # Data access layer
├── services/
│   └── auth.service.ts      # Business logic
├── types/
│   ├── express.ts           # Express types
│   └── index.ts             # Common types
├── utils/
│   ├── email.ts             # Email utilities
│   ├── jwt.ts               # JWT utilities
│   ├── password.ts          # Password hashing
│   └── sanitizer.ts         # Input sanitization
└── server.ts                # Application entry point
```

## ✨ Key Features

- ✅ Full TypeScript
- ✅ Sequelize ORM
- ✅ Repository Pattern
- ✅ routing-controllers (automatic routing & validation)
- ✅ class-validator + class-transformer (DTO validation)
- ✅ builder-pattern (fluent API responses)
- ✅ http-status-codes
- ✅ Input sanitization
- ✅ JWT authentication
- ✅ Bcrypt hashing
- ✅ Error handling
- ✅ Secure responses

## 🛠️ Commands

```bash
npm run dev       # Development
npm run build     # Compile
npm start         # Production
```

- `POST /api/auth/logout` - Logout (requires auth)
