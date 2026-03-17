import { Player } from 'src/player/interfaces/Player.interface';

export class Match {
  category: string;
  players: Player[];
  def: Player;
  result: Result[];
}

export class Result {
  setMatch: string;
}
