import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdatePaymentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
