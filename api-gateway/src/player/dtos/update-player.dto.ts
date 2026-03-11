import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdatePlayerDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  name?: string;

  @IsOptional()
  @IsString()
  ranking?: string;

  @IsOptional()
  @IsInt()
  positionRanking?: number;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(250)
  pictureUrl?: string;
}
