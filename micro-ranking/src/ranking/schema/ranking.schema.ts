import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MatchHistory, Ranking } from '../entities/Ranking';
import mongoose, { Types } from 'mongoose';

@Schema({ _id: false })
class MatchHistorySubSchema extends mongoose.Document {
  @Prop({ isRequired: true, type: Number })
  victory: number;

  @Prop({ isRequired: true, type: Number })
  defeat: number;
}

const MatchHistoryObj = SchemaFactory.createForClass(MatchHistorySubSchema);

export type RankingDocument = Document & RankingSchemaDb;

@Schema({ timestamps: true })
export class RankingSchemaDb implements Ranking {
  @Prop({ type: Types.ObjectId, isRequired: true })
  player: string;

  @Prop({ type: Number, isRequired: true })
  score: number;

  @Prop({ type: Number, isRequired: true })
  position: number;

  @Prop({ isRequired: true, type: MatchHistoryObj })
  matchHistory: MatchHistory;
}

export const RankingSchema = SchemaFactory.createForClass(RankingSchemaDb);
