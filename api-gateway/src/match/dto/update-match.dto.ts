import { ArrayMinSize, IsArray, IsMongoId, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { Result } from '../interfaces/match.interface';
import { Player } from 'src/player/interfaces/Player.interface';

export class UpdateMatchDto {
  @IsNotEmpty()
  @IsMongoId()
  def: Player;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => Array<Result>)
  result: Result[];
}
