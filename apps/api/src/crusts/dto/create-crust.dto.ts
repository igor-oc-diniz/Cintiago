import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCrustDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  priceSmall?: number;

  @IsOptional()
  @IsNumber()
  priceMedium?: number;

  @IsOptional()
  @IsNumber()
  priceLarge?: number;
}
