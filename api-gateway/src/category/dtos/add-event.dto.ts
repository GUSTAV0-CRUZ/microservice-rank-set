import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { EventOfCategory } from '../interfaces/category.interface';

export class AddEventDto implements EventOfCategory {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsString()
  operation: string;
}
