import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';

export class CreateChallengeDto {
  @IsDateString()
  @IsNotEmpty()
  dateHourChallenge: Date;

  @IsNotEmpty()
  @Type(() => String)
  @IsMongoId()
  applicant: string;

  @IsArray()
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  players: string[];
}
