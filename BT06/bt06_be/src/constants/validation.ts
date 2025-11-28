/**
 * Validation constants and rules
 */

export const VALIDATION = {
  EMAIL: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 255,
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    // At least 1 uppercase, 1 lowercase, 1 number, 1 special char
    REGEX:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  },
  FULL_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 255,
    REGEX:
      /^[a-zA-Z\s'àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ-]+$/i,
  },
  TOKEN: {
    EXPIRY: 7 * 24 * 60 * 60, // 7 days in seconds
    RESET_EXPIRY: 1 * 60 * 60, // 1 hour in seconds
  },
  SALT_ROUNDS: 10,
};

export const ERROR_MESSAGES = {
  // Auth errors
  INVALID_EMAIL: "Email không hợp lệ",
  INVALID_PASSWORD:
    "Mật khẩu phải chứa ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt",
  INVALID_FULL_NAME: "Tên đầy đủ không hợp lệ",
  PASSWORD_MISMATCH: "Mật khẩu không khớp",
  USER_EXISTS: "Email đã được đăng ký",
  USER_NOT_FOUND: "Email hoặc mật khẩu không đúng",
  INVALID_CREDENTIALS: "Email hoặc mật khẩu không đúng",
  TOKEN_EXPIRED: "Token đã hết hạn",
  INVALID_TOKEN: "Token không hợp lệ",
  UNAUTHORIZED: "Bạn chưa được xác thực",

  // Server errors
  INTERNAL_ERROR: "Lỗi máy chủ nội bộ",
  DATABASE_ERROR: "Lỗi cơ sở dữ liệu",
  EMAIL_ERROR: "Lỗi gửi email",
};

export const SUCCESS_MESSAGES = {
  REGISTER_SUCCESS: "Đăng ký thành công",
  LOGIN_SUCCESS: "Đăng nhập thành công",
  PASSWORD_RESET_SENT: "Email đặt lại mật khẩu đã được gửi",
  PASSWORD_RESET_SUCCESS: "Đặt lại mật khẩu thành công",
  LOGOUT_SUCCESS: "Đăng xuất thành công",
};
