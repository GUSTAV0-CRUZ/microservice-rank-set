import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';

export class CreateRankingDto {
  @IsArray()
  @Type(() => String)
  players: string[];
}
