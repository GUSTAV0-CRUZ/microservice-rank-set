import { ArrayMinSize, IsArray, IsMongoId, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { Result } from '../entities/match.entity';

export class UpdateMatchDto {
  @IsNotEmpty()
  @IsMongoId()
  def: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => Result)
  result: Result[];
}
