// import { Type } from 'class-transformer';
// import {
//   ArrayMaxSize,
//   ArrayMinSize,
//   IsArray,
//   IsMongoId,
//   IsNotEmpty,
//   IsString,
// } from 'class-validator';
// import { Result } from '../entities/match.entity';
// import { Player } from 'src/player/entities/Player.entitie';
// import { Challenge } from 'src/challenge/entities/challenge.entity';

// export class CreateMatchDto {
//   @IsString()
//   @IsNotEmpty()
//   category: string;

//   @IsNotEmpty()
//   @IsArray()
//   @ArrayMinSize(2)
//   @ArrayMaxSize(2)
//   @IsMongoId({ each: true })
//   @Type(() => Array)
//   players: Player[];

//   @IsNotEmpty()
//   @IsMongoId({ each: true })
//   def: Player;

//   @IsNotEmpty()
//   @IsArray()
//   @ArrayMinSize(1)
//   @Type(() => Array<Result>)
//   result: Result[];

//   @IsNotEmpty()
//   @IsMongoId({ each: true })
//   challenge: Challenge;
// }
