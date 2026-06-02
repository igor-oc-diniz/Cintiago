import { IsNumber, IsOptional } from 'class-validator';

export class UpdateIngredientPriceDto {
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
