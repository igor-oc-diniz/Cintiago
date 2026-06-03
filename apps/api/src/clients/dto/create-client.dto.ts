import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @IsInt()
  userId!: number;

  @IsString()
  phone!: string;

  @IsString()
  street!: string;

  @IsString()
  number!: string;

  @IsOptional()
  @IsString()
  complement?: string;

  @IsString()
  neighborhood!: string;

  @IsString()
  city!: string;

  @IsString()
  zipCode!: string;
}
