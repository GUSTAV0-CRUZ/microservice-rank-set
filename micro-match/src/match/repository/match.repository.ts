// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { UpdateMatchDto } from '../dto/update-match.dto';
// import { Model } from 'mongoose';
// import { MatchDocument } from '../schema/match.schema';
// import { CreateMatchDto } from '../dto/create-match.dto';
// import { PaginationDto } from 'src/utils/pagination.dto';

// @Injectable()
// export class MatchRepository {
//   constructor(
//     @InjectModel('Match')
//     private matchModel: Model<MatchDocument>,
//   ) {}

//   findAll(paginationDto: PaginationDto) {
//     return this.matchModel
//       .find()
//       .skip(paginationDto.offset ?? 0)
//       .limit(paginationDto.limit ?? 10)
//       .populate('players')
//       .exec();
//   }

//   findOneId(id: string) {
//     return this.matchModel.findById(id).exec();
//   }

//   create(creatematchDto: CreateMatchDto) {
//     return this.matchModel.create(creatematchDto);
//   }

//   update(id: string, updatematchDto: UpdateMatchDto) {
//     return this.matchModel
//       .findByIdAndUpdate(id, updatematchDto, { returnDocument: 'after' })
//       .exec();
//   }

//   delete(id: string) {
//     return this.matchModel.findByIdAndDelete(id).exec();
//   }
// }
