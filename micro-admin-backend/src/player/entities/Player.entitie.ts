import { Types } from 'mongoose';

export class Player {
  _id?: Types.ObjectId;
  tell: string;
  email: string;
  name: string;
  ranking: string;
  positionRanking: number;
  pictureUrl: string;
}
