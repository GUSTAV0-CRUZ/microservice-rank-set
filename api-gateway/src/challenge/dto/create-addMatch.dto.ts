import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';
import { ResultInterface } from '../interfaces/result.interface';

export class CreateAddMatchDto {
  @IsNotEmpty()
  @IsMongoId()
  def: string;

  @ArrayMinSize(1)
  @IsArray()
  @ArrayNotEmpty()
  result: ResultInterface[];
}
