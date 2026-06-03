import { IsOptional, IsString } from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  category?: string;
}
