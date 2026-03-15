import { ChallengeStatus } from '../enums/challenge-status.enum';
import { Challenge } from '../entities/challenge.entity';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type ChallengeDocument = Document & ChallengeSchemaDb;

@Schema({ timestamps: true })
export class ChallengeSchemaDb implements Challenge {
  @Prop({ type: Date })
  dateHourChallenge: Date;

  @Prop({ type: Date })
  dateHourRequest: Date;

  @Prop({ type: Date })
  dateHourResponse: Date;

  @Prop({
    type: String,
    enum: ChallengeStatus,
    default: ChallengeStatus.PENDING,
  })
  status: ChallengeStatus;

  @Prop({ type: mongoose.Schema.ObjectId })
  applicant: string;

  @Prop({ type: String })
  category: string;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ])
  players: string[];

  @Prop({ type: mongoose.Schema.ObjectId })
  match: string;
}
export const ChallengeSchema = SchemaFactory.createForClass(ChallengeSchemaDb);
