import { Injectable } from '@nestjs/common';
import { CreateRankingDto } from './dtos/create-ranking.dto';
import { UpdateRankingDto } from './dtos/update-ranking.dto';

@Injectable()
export class RankingService {
  async create(createRankingDto: CreateRankingDto) {}
  async findAll() {}
  async findOne(id: string) {}
  async update(id: string, updateRankingDto: UpdateRankingDto) {}
  async delete(id: string) {}
}
