import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';

export class CreateAddMatchDto {
  @IsNotEmpty()
  @IsMongoId({ each: true })
  def: string;

  @ArrayMinSize(1)
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  result: string[];
}
