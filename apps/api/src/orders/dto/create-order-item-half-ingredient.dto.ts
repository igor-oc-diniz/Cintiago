import { IsIn, IsInt, IsString } from 'class-validator';

export class CreateOrderItemHalfIngredientDto {
  @IsInt()
  ingredientId: number;

  @IsString()
  @IsIn(['add', 'remove'])
  action: string;
}
