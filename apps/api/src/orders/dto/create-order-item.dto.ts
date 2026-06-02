import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
  IsString,
} from 'class-validator';
import { CreateOrderItemHalfDto } from './create-order-item-half.dto';

export class CreateOrderItemDto {
  @IsString()
  @IsIn(['small', 'medium', 'large'])
  size: string;

  @IsOptional()
  @IsInt()
  crustId?: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemHalfDto)
  halves: CreateOrderItemHalfDto[];
}
