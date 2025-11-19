import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Length,
  IsInt,
  IsUrl,
} from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: "Tên sản phẩm không được để trống" })
  @Length(2, 255, { message: "Tên sản phẩm phải từ 2-255 ký tự" })
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: "Giá phải là số" })
  @Min(0, { message: "Giá phải lớn hơn hoặc bằng 0" })
  price!: number;

  @IsInt({ message: "Số lượng phải là số nguyên" })
  @Min(0, { message: "Số lượng phải lớn hơn hoặc bằng 0" })
  stock!: number;

  @IsString()
  @IsOptional()
  @IsUrl({}, { message: "URL hình ảnh không hợp lệ" })
  imageUrl?: string;

  @IsInt({ message: "ID danh mục phải là số nguyên" })
  @IsNotEmpty({ message: "ID danh mục không được để trống" })
  categoryId!: number;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @Length(2, 255, { message: "Tên sản phẩm phải từ 2-255 ký tự" })
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: "Giá phải là số" })
  @IsOptional()
  @Min(0, { message: "Giá phải lớn hơn hoặc bằng 0" })
  price?: number;

  @IsInt({ message: "Số lượng phải là số nguyên" })
  @IsOptional()
  @Min(0, { message: "Số lượng phải lớn hơn hoặc bằng 0" })
  stock?: number;

  @IsString()
  @IsOptional()
  @IsUrl({}, { message: "URL hình ảnh không hợp lệ" })
  imageUrl?: string;

  @IsInt({ message: "ID danh mục phải là số nguyên" })
  @IsOptional()
  categoryId?: number;
}
