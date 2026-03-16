import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateChallengeDto } from '../dto/create-challenge.dto';
import { ChallengeDocument } from '../schema/challenge.schema';
import { UpdateChallengeDto } from '../dto/update-challenge.dto';

@Injectable()
export class ChallengeRepository {
  constructor(
    @InjectModel('Challenge')
    private challengeModel: Model<ChallengeDocument>,
  ) {}

  findAll() {
    return this.challengeModel.find();
  }

  findOneId(id: string) {
    return this.challengeModel.findById(id).exec();
  }

  create(createChallengeDto: CreateChallengeDto) {
    return this.challengeModel.create(createChallengeDto);
  }

  update(id: string, updateChallengeDto: UpdateChallengeDto) {
    return this.challengeModel
      .findByIdAndUpdate(id, updateChallengeDto, { returnDocument: 'after' })
      .exec();
  }

  // findChallengesByIdPlayer(id: string) {
  //   const idSeach: unknown = id;
  //   return this.challengeModel.find({ players: idSeach as Player }).exec();
  // }

  // addMatch(
  //   id: string,
  //   challengeAddMatchRepositoryDto: ChallengeAddMatchRepositoryDto,
  // ) {
  //   return this.challengeModel
  //     .findByIdAndUpdate(id, challengeAddMatchRepositoryDto, {
  //       returnDocument: 'after',
  //     })
  //     .populate('match')
  //     .exec();
  // }

  // delete(id: string) {
  //   return this.challengeModel.findByIdAndDelete(id).exec();
  // }
}
