import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { RankingDocument } from '../schema/ranking.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRankingDto } from '../dtos/create-ranking.dto';
import { UpdateRankingDto } from '../dtos/update-ranking.dto';

@Injectable()
export class RankingRepository {
  constructor(
    @InjectModel('Ranking')
    private readonly rankingModel: Model<RankingDocument>,
  ) {}

  findAll() {
    return this.rankingModel.find();
  }

  findOneId(id: string) {
    return this.rankingModel.findById(id).exec();
  }

  create(createrankingDto: CreateRankingDto) {
    return this.rankingModel.create(createrankingDto);
  }

  update(id: string, updateRankingDto: UpdateRankingDto) {
    return this.rankingModel
      .findByIdAndUpdate(id, updateRankingDto, { returnDocument: 'after' })
      .exec();
  }

  delete(id: string) {
    return this.rankingModel.findByIdAndDelete(id).exec();
  }
}
