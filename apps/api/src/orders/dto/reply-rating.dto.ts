import { IsString } from 'class-validator';

export class ReplyRatingDto {
  @IsString()
  reply: string;
}
