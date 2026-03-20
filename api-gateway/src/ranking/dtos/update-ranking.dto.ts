import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { MatchHistory } from '../interfaces/ranking.interface';
import { Type } from 'class-transformer';

export class UpdateRankingDto {
  @IsInt()
  @IsNotEmpty()
  position: number;

  @IsInt()
  @IsOptional()
  score: number;

  @IsNotEmpty()
  @Type(() => MatchHistory)
  matchHistory: MatchHistory;
}
