// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Player } from '../entities/Player.entitie';

export type PlayerDocument = PlayerSchemaDb & Document;

@Schema({ timestamps: true })
export class PlayerSchemaDb implements Player {
  @Prop({ required: false, unique: true })
  tell: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  ranking: string;

  @Prop({ required: true })
  positionRanking: number;

  @Prop({ required: false })
  pictureUrl: string;
}

export const PlayerSchema = SchemaFactory.createForClass(PlayerSchemaDb);
