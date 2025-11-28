import { IsString, IsNotEmpty, IsOptional, Length } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: "Tên danh mục không được để trống" })
  @Length(2, 255, { message: "Tên danh mục phải từ 2-255 ký tự" })
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty({ message: "Slug không được để trống" })
  @Length(2, 255, { message: "Slug phải từ 2-255 ký tự" })
  slug!: string;
}

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  @Length(2, 255, { message: "Tên danh mục phải từ 2-255 ký tự" })
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @Length(2, 255, { message: "Slug phải từ 2-255 ký tự" })
  slug?: string;
}
