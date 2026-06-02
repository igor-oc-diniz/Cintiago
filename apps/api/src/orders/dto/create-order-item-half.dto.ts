import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateOrderItemHalfIngredientDto } from './create-order-item-half-ingredient.dto';
import { Type } from 'class-transformer';

export class CreateOrderItemHalfDto {
  @IsInt()
  pizzaId: number;

  @IsInt()
  @IsIn([1, 2])
  half: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemHalfIngredientDto)
  ingredients?: CreateOrderItemHalfIngredientDto[];
}
