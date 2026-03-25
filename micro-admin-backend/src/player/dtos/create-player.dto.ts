import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly tell?: string;

  @IsString()
  readonly ranking: string;

  @IsInt()
  readonly positionRanking: number;

  @IsString()
  readonly pictureUrl: string;
}
