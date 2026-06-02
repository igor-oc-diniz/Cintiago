import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class CreateIngredientPriceDto {
  @IsInt()
  ingredientId: number;

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
