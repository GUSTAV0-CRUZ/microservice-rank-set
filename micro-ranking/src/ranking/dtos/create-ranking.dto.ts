import { MatchHistory } from '../entities/Ranking';

export class CreateRankingDto {
  player: string;
  position: number;
  score: number;
  matchHistory: MatchHistory;
}
