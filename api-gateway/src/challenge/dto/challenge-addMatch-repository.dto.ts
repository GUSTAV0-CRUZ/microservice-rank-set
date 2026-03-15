import { ChallengeStatus } from '../enums/challenge-status.enum';

export class ChallengeAddMatchRepositoryDto {
  match: string;
  status: ChallengeStatus;
}
