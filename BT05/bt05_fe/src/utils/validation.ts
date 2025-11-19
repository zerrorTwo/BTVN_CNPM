import { Rule } from "antd/es/form";

/**
 * Common validation rules for forms
 */

// Email validation
export const emailRules: Rule[] = [
  {
    required: true,
    message: "Email không được để trống",
  },
  {
    type: "email",
    message: "Email không hợp lệ",
  },
  {
    max: 255,
    message: "Email không được vượt quá 255 ký tự",
  },
];

// Password validation
export const passwordRules: Rule[] = [
  {
    required: true,
    message: "Mật khẩu không được để trống",
  },
  {
    min: 6,
    message: "Mật khẩu phải có ít nhất 6 ký tự",
  },
  {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message: "Mật khẩu phải chứa chữ hoa, chữ thường và số",
  },
];

// Full name validation
export const fullNameRules: Rule[] = [
  {
    required: true,
    message: "Họ tên không được để trống",
  },
  {
    min: 2,
    message: "Họ tên phải có ít nhất 2 ký tự",
  },
  {
    max: 255,
    message: "Họ tên không được vượt quá 255 ký tự",
  },
];

// Confirm password validation
export const confirmPasswordRules = (
  fieldName: string = "password"
): Rule[] => [
  {
    required: true,
    message: "Vui lòng xác nhận mật khẩu",
  },
  ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue(fieldName) === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
    },
  }),
];

// Product name validation
export const productNameRules: Rule[] = [
  {
    required: true,
    message: "Tên sản phẩm không được để trống",
  },
  {
    min: 2,
    message: "Tên sản phẩm phải có ít nhất 2 ký tự",
  },
  {
    max: 255,
    message: "Tên sản phẩm không được vượt quá 255 ký tự",
  },
];

// Price validation
export const priceRules: Rule[] = [
  {
    required: true,
    message: "Giá không được để trống",
  },
  {
    type: "number",
    min: 0,
    message: "Giá phải lớn hơn hoặc bằng 0",
  },
];

// Stock validation
export const stockRules: Rule[] = [
  {
    required: true,
    message: "Số lượng không được để trống",
  },
  {
    type: "number",
    min: 0,
    message: "Số lượng phải lớn hơn hoặc bằng 0",
  },
];

// Category validation
export const categoryRules: Rule[] = [
  {
    required: true,
    message: "Danh mục không được để trống",
  },
];

// URL validation
export const urlRules: Rule[] = [
  {
    type: "url",
    message: "URL không hợp lệ",
  },
];

// Description validation (optional)
export const descriptionRules: Rule[] = [
  {
    max: 5000,
    message: "Mô tả không được vượt quá 5000 ký tự",
  },
];
