import { ChallengeStatus } from '../enums/challenge-status.enum';

export class Challenge {
  dateHourChallenge: Date;
  dateHourRequest: Date;
  dateHourResponse: Date;
  status: ChallengeStatus;
  applicant: string;
  category: string;
  players: string[];
  match: string;
}
