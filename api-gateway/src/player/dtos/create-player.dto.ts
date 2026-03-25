import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePlayerDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(11)
  @IsOptional()
  readonly tell?: string;

  @IsString()
  @IsNotEmpty()
  readonly ranking: string;

  @IsNotEmpty()
  @IsInt()
  readonly positionRanking: number;

  @IsString()
  @MaxLength(250)
  readonly pictureUrl: string;
}
