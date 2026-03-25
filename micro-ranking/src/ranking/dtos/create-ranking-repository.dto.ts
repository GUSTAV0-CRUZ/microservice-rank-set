import { IsNumber, IsString } from 'class-validator';
import { MatchHistory } from '../entities/Ranking';
import { Type } from 'class-transformer';

export class CreateRankingRepositoryDto {
  @IsString()
  player: string;

  @IsNumber()
  score: number;

  @IsNumber()
  position: number;

  @Type(() => MatchHistory)
  matchHistory: MatchHistory;
}
