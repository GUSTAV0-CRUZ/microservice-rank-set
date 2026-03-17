import { Match, Result } from 'src/match/entities/match.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ _id: false })
export class ResultItem extends mongoose.Document {
  @Prop({ required: true })
  setMacth: string;
}

const ResultItemSubSchema = SchemaFactory.createForClass(ResultItem);

export type MatchDocument = Document & MatchSchemaDb;

@Schema({ timestamps: true })
export class MatchSchemaDb implements Match {
  @Prop({ type: String })
  category: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId }])
  players: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  def: string;

  @Prop({ type: [ResultItemSubSchema] })
  result: Result[];

  @Prop({ type: mongoose.Schema.ObjectId })
  challenge: string;
}

export const MatchSchema = SchemaFactory.createForClass(MatchSchemaDb);
