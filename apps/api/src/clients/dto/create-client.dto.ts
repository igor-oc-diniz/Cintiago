import { IsInt } from 'class-validator';
import { CreateMyClientDto } from './create-my-client.dto';

export class CreateClientDto extends CreateMyClientDto {
  @IsInt()
  userId!: number;
}
