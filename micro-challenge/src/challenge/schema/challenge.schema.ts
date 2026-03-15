// import { Player } from 'src/player/entities/Player.entitie';
// import { ChallengeStatus } from '../enums/challenge-status.enum';
// import { Challenge } from '../entities/challenge.entity';
// import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
// import mongoose from 'mongoose';
// import { Match } from 'src/match/entities/match.entity';

// export type ChallengeDocument = Document & ChallengeSchemaDb;

// @Schema({ timestamps: true })
// export class ChallengeSchemaDb implements Challenge {
//   @Prop({ type: Date })
//   dateHourChallenge: Date;

//   @Prop({ type: Date })
//   dateHourRequest: Date;

//   @Prop({ type: Date })
//   dateHourResponse: Date;

//   @Prop({
//     type: String,
//     enum: ChallengeStatus,
//     default: ChallengeStatus.PENDING,
//   })
//   status: ChallengeStatus;

//   @Prop({ type: mongoose.Schema.ObjectId, ref: 'Player' })
//   applicant: Player;

//   @Prop({ type: String })
//   category: string;

//   @Prop([
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Player',
//     },
//   ])
//   players: Player[];

//   @Prop({ type: mongoose.Schema.ObjectId, ref: 'Match' })
//   match: Match;
// }
// export const ChallengeSchema = SchemaFactory.createForClass(ChallengeSchemaDb);
