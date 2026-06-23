import { IsOptional, IsString } from 'class-validator';

export class CreateMyClientDto {
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
