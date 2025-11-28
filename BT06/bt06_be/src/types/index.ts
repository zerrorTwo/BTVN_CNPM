export interface User {
  id?: number;
  email: string;
  password: string;
  fullName: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DecodedToken {
  id: number;
  email: string;
  role: string;
}

// Legacy interfaces - still used by auth.service.ts
export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}
