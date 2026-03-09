// import { Player } from 'src/player/entities/Player.entitie';

export class Category {
  _id?: string;
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
