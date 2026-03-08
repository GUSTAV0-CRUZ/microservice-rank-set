import { Player } from 'src/player/interfaces/Player.interface';

export interface Category {
  name: string;
  description: string;
  events: EventOfCategory[];
  players: Player[];
}

export interface EventOfCategory {
  name: string;
  operation: string;
  value: number;
}
