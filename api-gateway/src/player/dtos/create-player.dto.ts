import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePlayerDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(250)
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(11)
  readonly tell: string;

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
