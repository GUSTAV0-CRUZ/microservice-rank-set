// import { Player } from 'src/player/entities/Player.entitie';
// import { Match, Result } from 'src/match/entities/match.entity';
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import mongoose from 'mongoose';
// import { Challenge } from 'src/challenge/entities/challenge.entity';

// export type MatchDocument = Document & MatchSchemaDb;

// @Schema({ timestamps: true })
// export class MatchSchemaDb implements Match {
//   @Prop({ type: String })
//   category: string;

//   @Prop([
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Player',
//     },
//   ])
//   players: Player[];

//   @Prop({
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Player',
//   })
//   def: Player;

//   @Prop([
//     {
//       set: { type: String },
//     },
//   ])
//   result: Result[];

//   @Prop({ type: mongoose.Schema.ObjectId, ref: 'Challenge' })
//   challenge: Challenge;
// }

// export const MatchSchema = SchemaFactory.createForClass(MatchSchemaDb);
