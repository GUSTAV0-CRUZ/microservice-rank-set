// /* eslint-disable @typescript-eslint/no-unsafe-argument */
// import {
//   BadRequestException,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { CreateChallengeDto } from './dto/create-challenge.dto';
// import { UpdateChallengeDto } from './dto/update-challenge.dto';
// import { ChallengeRepository } from './repository/challenge.repository';
// import { PlayerService } from 'src/player/player.service';
// import { CategoryService } from 'src/category/category.service';
// import { ChallengeStatus } from './enums/challenge-status.enum';
// import { Challenge } from './entities/challenge.entity';
// import { MatchService } from 'src/match/match.service';
// import { CreateAddMatchDto } from './dto/create-addMatch.dto';
// import { PaginationDto } from 'src/utils/pagination.dto';

// @Injectable()
// export class ChallengeService {
//   constructor(
//     private readonly challengeRepository: ChallengeRepository,
//     private readonly playerService: PlayerService,
//     private readonly categoryService: CategoryService,
//     private readonly matchService: MatchService,
//   ) {}

//   async create(createChallengeDto: CreateChallengeDto): Promise<Challenge> {
//     try {
//       const { players, applicant, dateHourChallenge } = createChallengeDto;

//       const idOApplicant: unknown = applicant;
//       const idOne: unknown = players[0];
//       const idTwo: unknown = players[1];

//       await this.playerService.findOne(idOne as any);
//       await this.playerService.findOne(idTwo as any);

//       if (idOne !== applicant && idTwo !== applicant)
//         throw new BadRequestException(
//           'Applicant not is one player of challenge',
//         );

//       const category = await this.categoryService.findCategoryContainPlayerId(
//         idOApplicant as string,
//       );

//       const challenge = {
//         dateHourChallenge,
//         applicant,
//         players,
//         dateHourRequest: new Date(),
//         status: ChallengeStatus.PENDING,
//         category: category.name,
//       };

//       const newChallenge = this.challengeRepository.create(challenge);

//       return newChallenge;
//     } catch (error) {
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//       throw new BadRequestException(error.message);
//     }
//   }

//   findAll(paginationDto: PaginationDto) {
//     return this.challengeRepository.findAll(paginationDto);
//   }

//   async findOne(id: string): Promise<Challenge> {
//     try {
//       const challenge = await this.challengeRepository.findOneId(id);

//       if (!challenge) throw new NotFoundException();

//       return challenge;
//     } catch (error) {
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//       if (error.path === '_id')
//         throw new BadRequestException('Type of id invalid');

//       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//       if (error.status === 404)
//         throw new NotFoundException('Challenge not found');

//       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//       throw new BadRequestException(error.message);
//     }
//   }

//   async findChallengesByIdPlayer(id: string): Promise<Challenge[]> {
//     try {
//       const challenge =
//         await this.challengeRepository.findChallengesByIdPlayer(id);

//       if (!challenge) throw new NotFoundException();

//       return challenge;
//     } catch (error) {
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//       if (error.path === '_id')
//         throw new BadRequestException('Type of id invalid');

//       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//       if (error.status === 404)
//         throw new NotFoundException('Challenge not found');

//       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//       throw new BadRequestException(error.message);
//     }
//   }

//   async update(
//     id: string,
//     updateChallengeDto: UpdateChallengeDto,
//   ): Promise<Challenge> {
//     try {
//       const challenge = await this.challengeRepository.update(
//         id,
//         updateChallengeDto,
//       );

//       if (!challenge) throw new NotFoundException();

//       return challenge;
//     } catch (error) {
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//       if (error.path === '_id')
//         throw new BadRequestException('Type of id invalid');

//       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//       if (error.status === 404)
//         throw new NotFoundException('Challenge not found');

//       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//       throw new BadRequestException(error.message);
//     }
//   }

//   async delete(id: string): Promise<Challenge> {
//     try {
//       const challenge = await this.challengeRepository.delete(id);

//       if (!challenge) throw new NotFoundException();

//       return challenge;
//     } catch (error) {
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//       if (error.path === '_id')
//         throw new BadRequestException('Type of id invalid');

//       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//       if (error.status === 404)
//         throw new NotFoundException('Challenge not found');

//       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//       throw new BadRequestException(error.message);
//     }
//   }

//   async addMatch(
//     id: string,
//     createAddMatchDto: CreateAddMatchDto,
//   ): Promise<Challenge> {
//     try {
//       const challenge = await this.findOne(id);
//       const { category, players } = challenge;

//       const createMatch = await this.matchService.create({
//         category,
//         players,
//         def: createAddMatchDto.def,
//         result: createAddMatchDto.result,
//         challenge,
//       });

//       const challengeUpdated = await this.challengeRepository.addMatch(id, {
//         match: createMatch,
//         status: ChallengeStatus.ACCOMPLISHED,
//       });

//       if (!challengeUpdated) throw new BadRequestException();

//       return challengeUpdated;
//     } catch (error) {
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//       throw new BadRequestException(error.message);
//     }
//   }
// }
