import { MatchHistory } from '../entities/Ranking';

export class CreateRankingRepositoryDto {
  player: string;
  score: number;
  position: number;
  matchHistory: MatchHistory;
}
