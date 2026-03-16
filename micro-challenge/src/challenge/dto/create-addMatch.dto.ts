import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsMongoId, IsNotEmpty } from 'class-validator';
import { ResultInterface } from '../interfaces/result.interface';

export class CreateAddMatchDto {
  @IsNotEmpty()
  @IsMongoId()
  def: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsMongoId({ each: true })
  @Type(() => Array<ResultInterface>)
  result: ResultInterface[];
}
