import { IsEnum, IsString } from 'class-validator';
import { PaymentType } from '@prisma/client';

export class CreatePaymentDto {
  @IsString()
  name!: string;

  @IsEnum(PaymentType)
  type!: PaymentType;
}
