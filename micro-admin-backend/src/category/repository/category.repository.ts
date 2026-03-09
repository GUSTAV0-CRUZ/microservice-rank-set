import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryDocument } from '../schemas/category.schema';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
// import { AddPlayerDto } from '../dto/add-player.dto';
// import { RemovePlayerDto } from '../dto/remove-player.dto';
// import { Player } from 'src/player/entities/Player.entitie';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectModel('Category')
    private categoryModel: Model<CategoryDocument>,
  ) {}

  findAll() {
    return this.categoryModel.find().exec();
  }

  findOneId(id: string) {
    return this.categoryModel.findById(id).exec();
  }

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryModel.create(createCategoryDto);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const { name, description, addEvents, removeEvents } = updateCategoryDto;

    const operations = [
      {
        updateOne: {
          filter: { _id: id },
          update: {
            $set: { name, description },
            $pull: {
              events: {
                name: { $in: removeEvents?.map((event) => event.name) ?? [] },
                operation: {
                  $in: removeEvents?.map((event) => event.operation) ?? [],
                },
              },
            },
          },
        },
      },
      {
        updateOne: {
          filter: { _id: id },
          update: {
            $addToSet: {
              events: { $each: addEvents ?? [] },
            },
          },
        },
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await this.categoryModel.bulkWrite(operations as any);
    return this.categoryModel.findById(id).exec();
  }

  // async addPlayers(id: string, addPlayerDto: AddPlayerDto) {
  //   const { addPlayers } = addPlayerDto;
  //   return this.categoryModel.findOneAndUpdate(
  //     { _id: id },
  //     { $addToSet: { players: { $each: addPlayers ?? [] } } },
  //     { returnDocument: 'after' },
  //   );
  // }

  // async removePlayers(id: string, removePlayerDto: RemovePlayerDto) {
  //   const { removePlayers } = removePlayerDto;
  //   return this.categoryModel.findOneAndUpdate(
  //     { _id: id },
  //     { $pull: { players: { $in: removePlayers ?? [] } } },
  //     { returnDocument: 'after' },
  //   );
  // }

  // delete(id: string) {
  //   return this.categoryModel.findByIdAndDelete(id).exec();
  // }

  // findCategoryContainPlayerId(id: string) {
  //   const idSearch: unknown = new Types.ObjectId(id);
  //   return this.categoryModel.findOne({
  //     players: { $in: [idSearch as Player] },
  //   });
  // }
}
