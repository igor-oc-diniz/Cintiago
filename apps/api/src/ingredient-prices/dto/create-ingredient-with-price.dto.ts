import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateIngredientWithPriceDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  category?: string;

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
