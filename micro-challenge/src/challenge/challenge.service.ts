import { Injectable, Logger } from '@nestjs/common';
import { ChallengeRepository } from './repository/challenge.repository';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { Challenge } from './entities/challenge.entity';
import { ChallengeStatus } from './enums/challenge-status.enum';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ClienteProxyRmqService } from 'src/cliente-proxy-rmq/cliente-proxy-rmq.service';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ChallengeService {
  private readonly logger = new Logger(ChallengeService.name);
  private miCroBackendClientProxy: ClientProxy;
  constructor(
    private readonly challengeRepository: ChallengeRepository,
    clienteProxyRmqService: ClienteProxyRmqService,
  ) {
    this.miCroBackendClientProxy =
      clienteProxyRmqService.getClientProxyRmqAdminBackend();
  }

  private logError(error: any, methodName: string) {
    return this.logger.error({
      methodName,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      message: [error.message],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      stack: error.stack,
    });
  }

  async create(createChallengeDto: CreateChallengeDto): Promise<Challenge> {
    // this.logger.log(createChallengeDto);
    try {
      const { players, applicant, dateHourChallenge } = createChallengeDto;

      const idOne = players[0];
      const idTwo = players[1];

      await Promise.all([
        lastValueFrom(
          this.miCroBackendClientProxy.send('findOneById-player', idOne),
        ),
        lastValueFrom(
          this.miCroBackendClientProxy.send('findOneById-player', idTwo),
        ),
      ]);

      if (idOne !== applicant && idTwo !== applicant)
        throw new RpcException('Applicant not is one player of challenge');

      const category = await lastValueFrom<{ name: string }>(
        this.miCroBackendClientProxy.send(
          'findCategoryContainPlayerId-category',
          applicant,
        ),
      );

      const challenge = {
        dateHourChallenge,
        applicant,
        players,
        dateHourRequest: new Date(),
        status: ChallengeStatus.PENDING,
        category: category['name'],
      };

      const newChallenge = this.challengeRepository.create(challenge);

      return newChallenge;
    } catch (error) {
      this.logError(error, this.create.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }

  // findAll(paginationDto: PaginationDto) {
  //   return this.challengeRepository.findAll(paginationDto);
  // }

  // async findOne(id: string): Promise<Challenge> {
  //   try {
  //     const challenge = await this.challengeRepository.findOneId(id);

  //     if (!challenge) throw new NotFoundException();

  //     return challenge;
  //   } catch (error) {
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     if (error.path === '_id')
  //       throw new BadRequestException('Type of id invalid');

  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     if (error.status === 404)
  //       throw new NotFoundException('Challenge not found');

  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // async findChallengesByIdPlayer(id: string): Promise<Challenge[]> {
  //   try {
  //     const challenge =
  //       await this.challengeRepository.findChallengesByIdPlayer(id);

  //     if (!challenge) throw new NotFoundException();

  //     return challenge;
  //   } catch (error) {
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     if (error.path === '_id')
  //       throw new BadRequestException('Type of id invalid');

  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     if (error.status === 404)
  //       throw new NotFoundException('Challenge not found');

  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // async update(
  //   id: string,
  //   updateChallengeDto: UpdateChallengeDto,
  // ): Promise<Challenge> {
  //   try {
  //     const challenge = await this.challengeRepository.update(
  //       id,
  //       updateChallengeDto,
  //     );

  //     if (!challenge) throw new NotFoundException();

  //     return challenge;
  //   } catch (error) {
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     if (error.path === '_id')
  //       throw new BadRequestException('Type of id invalid');

  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     if (error.status === 404)
  //       throw new NotFoundException('Challenge not found');

  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // async delete(id: string): Promise<Challenge> {
  //   try {
  //     const challenge = await this.challengeRepository.delete(id);

  //     if (!challenge) throw new NotFoundException();

  //     return challenge;
  //   } catch (error) {
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     if (error.path === '_id')
  //       throw new BadRequestException('Type of id invalid');

  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     if (error.status === 404)
  //       throw new NotFoundException('Challenge not found');

  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // async addMatch(
  //   id: string,
  //   createAddMatchDto: CreateAddMatchDto,
  // ): Promise<Challenge> {
  //   try {
  //     const challenge = await this.findOne(id);
  //     const { category, players } = challenge;

  //     const createMatch = await this.matchService.create({
  //       category,
  //       players,
  //       def: createAddMatchDto.def,
  //       result: createAddMatchDto.result,
  //       challenge,
  //     });

  //     const challengeUpdated = await this.challengeRepository.addMatch(id, {
  //       match: createMatch,
  //       status: ChallengeStatus.ACCOMPLISHED,
  //     });

  //     if (!challengeUpdated) throw new BadRequestException();

  //     return challengeUpdated;
  //   } catch (error) {
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     throw new BadRequestException(error.message);
  //   }
  // }
}
