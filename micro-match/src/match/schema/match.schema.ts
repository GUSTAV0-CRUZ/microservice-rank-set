import { Match, Result } from 'src/match/entities/match.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type MatchDocument = Document & MatchSchemaDb;

@Schema({ timestamps: true })
export class MatchSchemaDb implements Match {
  @Prop({ type: String })
  category: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId }])
  players: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  def: string;

  @Prop([
    {
      set: { type: String },
    },
  ])
  result: Result[];

  @Prop({ type: mongoose.Schema.ObjectId })
  challenge: string;
}

export const MatchSchema = SchemaFactory.createForClass(MatchSchemaDb);
