import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveEventDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  operation: string;
}
