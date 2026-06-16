import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { FindOrdersQueryDto } from './find-orders-query.dto';

export class FindOrdersAdminQueryDto extends FindOrdersQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  clientId?: number;
}
