// import { Type } from 'class-transformer';
// import {
//   ArrayMaxSize,
//   ArrayMinSize,
//   IsArray,
//   IsDateString,
//   IsNotEmpty,
// } from 'class-validator';
// import { Player } from 'src/player/entities/Player.entitie';

// export class CreateChallengeDto {
//   @IsDateString()
//   @IsNotEmpty()
//   dateHourChallenge: Date;

//   @IsNotEmpty()
//   @Type(() => Player)
//   applicant: Player;

//   @IsArray()
//   @ArrayMaxSize(2)
//   @ArrayMinSize(2)
//   @Type(() => Array<Player>)
//   players: Player[];
// }
