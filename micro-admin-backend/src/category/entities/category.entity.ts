// import { Player } from 'src/player/entities/Player.entitie';

import { Types } from 'mongoose';

export class Category {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  events: EventOfCategory[];
  // players: Player[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EventOfCategory {
  name: string;
  operation: string;
  value: number;
}
