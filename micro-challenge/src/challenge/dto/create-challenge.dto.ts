import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
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
  @IsMongoId()
  @Type(() => String)
  applicant: string;

  @IsArray()
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  @IsMongoId({ each: true })
  @Type(() => Array<string>)
  players: string[];
}
