import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentType } from '@prisma/client';

export class UpdatePaymentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(PaymentType)
  type?: PaymentType;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
