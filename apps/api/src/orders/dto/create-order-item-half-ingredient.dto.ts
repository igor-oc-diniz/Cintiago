import { IsInt } from 'class-validator';

export class CreateOrderItemHalfIngredientDto {
  @IsInt()
  ingredientId: number;
}
