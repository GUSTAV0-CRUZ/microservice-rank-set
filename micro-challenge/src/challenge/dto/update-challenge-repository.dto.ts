import { UpdateChallengeStatus } from '../enums/update-challenge-status.enum';

export class UpdateChallengeRepositoryDto {
  status: UpdateChallengeStatus;
  dateHourResponse: Date;
}
