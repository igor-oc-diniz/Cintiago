import { IsInt, Min } from 'class-validator';

export class CreateOrderProductDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}
