# BT04 Frontend - MERN Auth Client

React + TypeScript + Vite + Ant Design

## Features

- ✅ Beautiful UI with Ant Design
- ✅ User Registration
- ✅ User Login with JWT
- ✅ Forgot Password
- ✅ Reset Password
- ✅ Protected Dashboard
- ✅ Logout

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start development server:

   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Pages

- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Forgot password request
- `/reset-password?token=...` - Reset password with token
- `/dashboard` - Protected dashboard (requires authentication)

## API Integration

The frontend communicates with the backend API at `http://localhost:5000/api`

All requests automatically include the JWT token in the Authorization header.
