import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class ModifyPerMatchDto {
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  category: string;

  @IsArray()
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  @IsMongoId({ each: true })
  players: Array<string>;

  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  def: string;
}
