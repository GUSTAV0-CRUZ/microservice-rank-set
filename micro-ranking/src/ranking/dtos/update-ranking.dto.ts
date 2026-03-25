import { IsInt, IsNumber, IsOptional } from 'class-validator';
import { MatchHistory } from '../entities/Ranking';
import { Type } from 'class-transformer';

export class UpdateRankingDto {
  @IsInt()
  position: number;

  @IsNumber()
  @IsOptional()
  score?: number;

  @IsOptional()
  @Type(() => MatchHistory)
  matchHistory?: MatchHistory;
}
