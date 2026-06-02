import { IsArray, IsInt, IsOptional, ValidateNested } from 'class-validator';
import { CreateOrderItemDto } from './create-order-item.dto';
import { Type } from 'class-transformer';
import { CreateOrderProductDto } from './create-order-product.dto';

export class CreateOrderDto {
  @IsInt()
  clientId: number;

  @IsInt()
  paymentId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProductDto)
  products?: CreateOrderProductDto[];
}
