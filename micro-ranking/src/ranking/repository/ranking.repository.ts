import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { RankingDocument } from '../schema/ranking.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateRankingDto } from '../dtos/update-ranking.dto';
import { CreateRankingRepositoryDto } from '../dtos/create-ranking-repository.dto';

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

  create(createRankingRepositoryDto: CreateRankingRepositoryDto) {
    return this.rankingModel.create(createRankingRepositoryDto);
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
