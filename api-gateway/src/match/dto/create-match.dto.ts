import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Result } from '../interfaces/match.interface';
import { Player } from 'src/player/interfaces/Player.interface';
import { Challenge } from 'src/challenge/interfaces/challenge.interface';

export class CreateMatchDto {
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsMongoId({ each: true })
  @Type(() => Array)
  players: Player[];

  @IsNotEmpty()
  @IsMongoId()
  def: Player;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => Array<Result>)
  result: Result[];

  @IsNotEmpty()
  @IsMongoId()
  challenge: Challenge;
}
