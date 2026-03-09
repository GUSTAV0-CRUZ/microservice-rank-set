import { Type } from 'class-transformer';
import { IsMongoId, IsOptional } from 'class-validator';

export class AddPlayerDto {
  @IsOptional()
  @IsMongoId({ each: true })
  @Type(() => Array)
  addPlayers: string[];
}
