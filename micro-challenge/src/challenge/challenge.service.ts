import { Injectable, Logger } from '@nestjs/common';
import { ChallengeRepository } from './repository/challenge.repository';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { Challenge } from './entities/challenge.entity';
import { ChallengeStatus } from './enums/challenge-status.enum';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ClienteProxyRmqService } from 'src/cliente-proxy-rmq/cliente-proxy-rmq.service';
import { lastValueFrom } from 'rxjs';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { CreateAddMatchDto } from './dto/create-addMatch.dto';

@Injectable()
export class ChallengeService {
  private readonly logger = new Logger(ChallengeService.name);
  private microBackendClientProxy: ClientProxy;
  private microMatchClientProxy: ClientProxy;

  constructor(
    private readonly challengeRepository: ChallengeRepository,
    clienteProxyRmqService: ClienteProxyRmqService,
  ) {
    this.microBackendClientProxy =
      clienteProxyRmqService.getClientProxyRmqAdminBackend();

    this.microMatchClientProxy =
      clienteProxyRmqService.getClientProxyRmqMicroMatch();
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

      await Promise.all([
        lastValueFrom(
          this.microBackendClientProxy.send('findOneById-player', players[0]),
        ),
        lastValueFrom(
          this.microBackendClientProxy.send('findOneById-player', players[1]),
        ),
      ]);

      if (players[0] !== applicant && players[1] !== applicant)
        throw new RpcException('Applicant not is one player of challenge');

      const category = await lastValueFrom<{ _id: string }>(
        this.microBackendClientProxy.send(
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
        category: category['_id'],
      };

      const newChallenge = this.challengeRepository.create(challenge);

      return newChallenge;
    } catch (error) {
      this.logError(error, this.create.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }

  findAll() {
    try {
      return this.challengeRepository.findAll();
    } catch (error) {
      this.logError(error, this.findAll.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }

  async findOne(id: string): Promise<Challenge> {
    try {
      const challenge = await this.challengeRepository.findOneId(id);

      if (!challenge) throw new RpcException('Challenge not found');

      return challenge;
    } catch (error) {
      this.logError(error, this.findOne.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.path === '_id') throw new RpcException('Type of id invalid');

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
      throw new RpcException(error.message);
    }
  }

  async update(
    id: string,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<Challenge> {
    // this.logger.log({ id, updateChallengeDto });
    const { status } = updateChallengeDto;
    const dateHourResponse = new Date();

    if ((await this.findOne(id)).status !== ChallengeStatus.PENDING)
      throw new RpcException(
        'The Status of Challenge should is "PENDING" for updateded',
      );

    try {
      const challenge = await this.challengeRepository.update(id, {
        status,
        dateHourResponse,
      });

      if (!challenge) throw new RpcException('Challenge not found');

      return challenge;
    } catch (error) {
      this.logError(error, this.update.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.path === '_id') throw new RpcException('Type of id invalid');

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
      throw new RpcException(error.message);
    }
  }

  async delete(id: string): Promise<Challenge> {
    try {
      const challenge = await this.challengeRepository.delete(id);

      if (!challenge) throw new RpcException('Challenge not found');

      return challenge;
    } catch (error) {
      this.logError(error, this.delete.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.path === '_id') throw new RpcException('Type of id invalid');

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }

  async findChallengesByIdPlayer(id: string): Promise<Challenge[]> {
    try {
      const challenge =
        await this.challengeRepository.findChallengesByIdPlayer(id);

      if (!challenge) throw new RpcException('Challenge not found');
      if (challenge.length === 0)
        throw new RpcException('Player not is in one challenge');

      return challenge;
    } catch (error) {
      this.logError(error, this.findChallengesByIdPlayer.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.path === '_id') throw new RpcException('Type of id invalid');

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
      throw new RpcException(error.message);
    }
  }

  async addMatch(
    id: string,
    createAddMatchDto: CreateAddMatchDto,
  ): Promise<Challenge> {
    try {
      const challenge = await this.findOne(id);

      if (challenge.status !== ChallengeStatus.ACCEPTED)
        throw new RpcException('Status of challenge should is "ACCEPTED"');

      const playerIsChallenge = challenge.players.filter(
        (idPlayer) => idPlayer.toString() === createAddMatchDto.def,
      );
      if (playerIsChallenge.length === 0)
        throw new RpcException('def not player of challenge');

      const { category, players } = challenge;

      const createMatch = await lastValueFrom<unknown>(
        this.microMatchClientProxy.send('create-match', {
          category,
          players,
          def: createAddMatchDto.def,
          result: createAddMatchDto.result,
          challenge,
        }),
      );

      const challengeUpdated = await this.challengeRepository.addMatch(id, {
        match: createMatch,
        status: ChallengeStatus.ACCOMPLISHED,
      });

      if (!challengeUpdated)
        throw new RpcException('Object of challenge is empity');

      return challengeUpdated;
    } catch (error) {
      this.logError(error, this.addMatch.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
      throw new RpcException(error.message);
    }
  }
}
