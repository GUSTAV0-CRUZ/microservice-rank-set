import { IsEnum, IsNotEmpty } from 'class-validator';
import { UpdateChallengeStatus } from '../enums/update-challenge-status.enum';

export class UpdateChallengeDto {
  @IsNotEmpty()
  @IsEnum(UpdateChallengeStatus)
  status: UpdateChallengeStatus;
}
