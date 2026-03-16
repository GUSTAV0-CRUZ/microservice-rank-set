import { ChallengeStatus } from '../enums/challenge-status.enum';
import { ResultInterface } from '../interfaces/result.interface';

export class ChallengeAddMatchRepositoryDto {
  match: {
    category: string;
    players: string[];
    def: string;
    result: ResultInterface[];
  };
  status: ChallengeStatus;
}
