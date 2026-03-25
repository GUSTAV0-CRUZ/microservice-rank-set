import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdatePlayerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  ranking?: string;

  @IsOptional()
  @IsInt()
  positionRanking?: number;

  @IsOptional()
  @IsString()
  pictureUrl?: string;
}
