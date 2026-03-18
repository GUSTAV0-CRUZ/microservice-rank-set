export class Ranking {
  _id?: string;
  player: string;
  position: number;
  score: number;
  matchHistory: MatchHistory;
  createdAt?: Date;
  updatedAt?: Date;
}

export class MatchHistory {
  victory: number;
  defeat: number;
}
