import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { VALIDATION, ERROR_MESSAGES } from "../constants/validation";

@ValidatorConstraint({ name: "isPasswordMatching", async: false })
export class IsPasswordMatchingConstraint
  implements ValidatorConstraintInterface
{
  validate(confirmPassword: string, args: ValidationArguments) {
    const object = args.object as any;
    return confirmPassword === object.password;
  }

  defaultMessage(args: ValidationArguments) {
    return ERROR_MESSAGES.PASSWORD_MISMATCH;
  }
}

export class RegisterDto {
  @IsEmail({}, { message: ERROR_MESSAGES.INVALID_EMAIL })
  @MinLength(VALIDATION.EMAIL.MIN_LENGTH, {
    message: `Email phải từ ${VALIDATION.EMAIL.MIN_LENGTH} đến ${VALIDATION.EMAIL.MAX_LENGTH} ký tự`,
  })
  @MaxLength(VALIDATION.EMAIL.MAX_LENGTH, {
    message: `Email phải từ ${VALIDATION.EMAIL.MIN_LENGTH} đến ${VALIDATION.EMAIL.MAX_LENGTH} ký tự`,
  })
  email!: string;

  @IsString()
  @MinLength(VALIDATION.PASSWORD.MIN_LENGTH, {
    message: `Mật khẩu phải từ ${VALIDATION.PASSWORD.MIN_LENGTH} đến ${VALIDATION.PASSWORD.MAX_LENGTH} ký tự`,
  })
  @MaxLength(VALIDATION.PASSWORD.MAX_LENGTH, {
    message: `Mật khẩu phải từ ${VALIDATION.PASSWORD.MIN_LENGTH} đến ${VALIDATION.PASSWORD.MAX_LENGTH} ký tự`,
  })
  @Matches(VALIDATION.PASSWORD.REGEX, {
    message: ERROR_MESSAGES.INVALID_PASSWORD,
  })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: "Xác nhận mật khẩu không được để trống" })
  @Validate(IsPasswordMatchingConstraint)
  confirmPassword!: string;

  @IsString()
  @MinLength(VALIDATION.FULL_NAME.MIN_LENGTH, {
    message: `Tên phải từ ${VALIDATION.FULL_NAME.MIN_LENGTH} đến ${VALIDATION.FULL_NAME.MAX_LENGTH} ký tự`,
  })
  @MaxLength(VALIDATION.FULL_NAME.MAX_LENGTH, {
    message: `Tên phải từ ${VALIDATION.FULL_NAME.MIN_LENGTH} đến ${VALIDATION.FULL_NAME.MAX_LENGTH} ký tự`,
  })
  @Matches(VALIDATION.FULL_NAME.REGEX, {
    message: ERROR_MESSAGES.INVALID_FULL_NAME,
  })
  fullName!: string;
}

export class LoginDto {
  @IsEmail({}, { message: ERROR_MESSAGES.INVALID_EMAIL })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: "Mật khẩu không được để trống" })
  @MaxLength(VALIDATION.PASSWORD.MAX_LENGTH, {
    message: "Mật khẩu không hợp lệ",
  })
  password!: string;
}

export class ForgotPasswordDto {
  @IsEmail({}, { message: ERROR_MESSAGES.INVALID_EMAIL })
  email!: string;

  @IsString()
  @MinLength(VALIDATION.PASSWORD.MIN_LENGTH, {
    message: `Mật khẩu phải từ ${VALIDATION.PASSWORD.MIN_LENGTH} đến ${VALIDATION.PASSWORD.MAX_LENGTH} ký tự`,
  })
  @MaxLength(VALIDATION.PASSWORD.MAX_LENGTH, {
    message: `Mật khẩu phải từ ${VALIDATION.PASSWORD.MIN_LENGTH} đến ${VALIDATION.PASSWORD.MAX_LENGTH} ký tự`,
  })
  @Matches(VALIDATION.PASSWORD.REGEX, {
    message: ERROR_MESSAGES.INVALID_PASSWORD,
  })
  password!: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: "Token không được để trống" })
  @MinLength(10, { message: ERROR_MESSAGES.INVALID_TOKEN })
  token!: string;

  @IsString()
  @MinLength(VALIDATION.PASSWORD.MIN_LENGTH, {
    message: `Mật khẩu phải từ ${VALIDATION.PASSWORD.MIN_LENGTH} đến ${VALIDATION.PASSWORD.MAX_LENGTH} ký tự`,
  })
  @MaxLength(VALIDATION.PASSWORD.MAX_LENGTH, {
    message: `Mật khẩu phải từ ${VALIDATION.PASSWORD.MIN_LENGTH} đến ${VALIDATION.PASSWORD.MAX_LENGTH} ký tự`,
  })
  @Matches(VALIDATION.PASSWORD.REGEX, {
    message: ERROR_MESSAGES.INVALID_PASSWORD,
  })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: "Xác nhận mật khẩu không được để trống" })
  @Validate(IsPasswordMatchingConstraint)
  confirmPassword!: string;
}
