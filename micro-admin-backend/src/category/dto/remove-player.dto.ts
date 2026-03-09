import { Type } from 'class-transformer';
import { IsMongoId, IsOptional } from 'class-validator';

export class RemovePlayerDto {
  @IsOptional()
  @IsMongoId({ each: true })
  @Type(() => Array)
  removePlayers: string[] | string;
}
