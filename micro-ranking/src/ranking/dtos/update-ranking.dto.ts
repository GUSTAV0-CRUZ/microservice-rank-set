import { MatchHistory } from '../entities/Ranking';

export class UpdateRankingDto {
  position: number;
  score: number;
  matchHistory: MatchHistory;
}
