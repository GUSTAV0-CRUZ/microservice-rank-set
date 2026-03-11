import { Injectable } from '@nestjs/common';
import { CreatePlayerDto } from '../dtos/create-player.dto';
import { UpdatePlayerDto } from '../dtos/update-player.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayerDocument } from '../schema/player.schema';
import { PaginationDto } from 'src/utils/pagination.dto';

@Injectable()
export class PlayerRepository {
  constructor(
    @InjectModel('Player')
    private playerModel: Model<PlayerDocument>,
  ) {}

  findAll(paginationDto: PaginationDto) {
    return this.playerModel
      .find()
      .skip(paginationDto.offset ?? 0)
      .limit(paginationDto.limit ?? 10)
      .exec();
  }

  findOneId(id: string) {
    return this.playerModel.findById(id).exec();
  }

  create(createPlayerDto: CreatePlayerDto) {
    return this.playerModel.create(createPlayerDto);
  }

  update(id: string, updatePlayerDto: UpdatePlayerDto) {
    return this.playerModel
      .findByIdAndUpdate(id, updatePlayerDto, { returnDocument: 'after' })
      .exec();
  }

  delete(id: string) {
    return this.playerModel.findByIdAndDelete(id).exec();
  }
}
