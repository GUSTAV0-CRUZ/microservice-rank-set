import { IsDateString, IsEnum, IsNotEmpty } from 'class-validator';
import { UpdateChallengeStatus } from '../enums/update-challenge-status.enum';

export class UpdateChallengeDto {
  @IsDateString()
  @IsNotEmpty()
  dateHourResponse: Date;

  @IsNotEmpty()
  @IsEnum(UpdateChallengeStatus)
  status: UpdateChallengeStatus;
}
