import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Result } from '../entities/match.entity';
import { Type } from 'class-transformer';

export class CreateMatchDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  category: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsMongoId({ each: true })
  @Type(() => Array)
  players: string[];

  @IsNotEmpty()
  @IsMongoId({ each: true })
  def: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => Result)
  result: Result[];

  @IsNotEmpty()
  @IsMongoId()
  challenge: string;
}
