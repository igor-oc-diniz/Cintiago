import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
  IsString,
  MaxLength,
} from 'class-validator';
import { CreateOrderItemHalfDto } from './create-order-item-half.dto';
import { PizzaSize } from '@prisma/client';

export class CreateOrderItemDto {
  @IsEnum(PizzaSize)
  size: PizzaSize;

  @IsOptional()
  @IsInt()
  crustId?: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemHalfDto)
  halves: CreateOrderItemHalfDto[];
}
