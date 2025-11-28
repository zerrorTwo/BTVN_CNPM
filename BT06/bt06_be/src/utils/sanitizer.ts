/**
 * Input sanitization utilities
 */

/**
 * Trim whitespace and convert to lowercase
 */
export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

/**
 * Trim whitespace
 */
export const sanitizeFullName = (fullName: string): string => {
  return fullName.trim().replace(/\s+/g, " ");
};

/**
 * Remove potentially dangerous characters
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets
    .substring(0, 1000); // Limit length
};

/**
 * Validate and sanitize email
 */
export const validateAndSanitizeEmail = (email: string): string => {
  const sanitized = sanitizeEmail(email);
  if (!sanitized || sanitized.length < 5 || sanitized.length > 255) {
    throw new Error("Email không hợp lệ");
  }
  return sanitized;
};

/**
 * Validate and sanitize full name
 */
export const validateAndSanitizeFullName = (fullName: string): string => {
  const sanitized = sanitizeFullName(fullName);
  if (!sanitized || sanitized.length < 2 || sanitized.length > 255) {
    throw new Error("Tên đầy đủ không hợp lệ");
  }
  return sanitized;
};
