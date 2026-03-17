import { ChallengeStatus } from '../enums/challenge-status.enum';

export class ChallengeAddMatchRepositoryDto {
  match: unknown;
  status: ChallengeStatus;
}
