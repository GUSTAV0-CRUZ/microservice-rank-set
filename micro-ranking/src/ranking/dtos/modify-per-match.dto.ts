import { Type } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

export class ModifyPerMatchDto {
  @IsString()
  category: string;

  @IsArray()
  @Type(() => String)
  players: Array<string>;

  @IsString()
  def: string;
}
