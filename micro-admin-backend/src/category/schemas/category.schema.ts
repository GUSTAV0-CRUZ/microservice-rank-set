import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Category, EventOfCategory } from '../entities/category.entity';
// import { Player } from 'src/player/entities/Player.entitie';
// import { SchemaTypes } from 'mongoose';

export type CategoryDocument = CategorySchemaDb & Document;

@Schema({ _id: false })
class EventOfCategorySubSchema implements EventOfCategory {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Number, required: true })
  value: number;

  @Prop({ required: true })
  operation: string;
}

const EventOfCategorySchema = SchemaFactory.createForClass(
  EventOfCategorySubSchema,
);

@Schema({ timestamps: true })
export class CategorySchemaDb implements Category {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [{ type: EventOfCategorySchema, default: [] }] })
  events: EventOfCategory[];

  // @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Player' }] })
  // players: Player[];
}

export const CategorySchema = SchemaFactory.createForClass(CategorySchemaDb);
