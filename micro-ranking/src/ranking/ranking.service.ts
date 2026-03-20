import { Injectable, Logger } from '@nestjs/common';
import { CreateRankingDto } from './dtos/create-ranking.dto';
import { UpdateRankingDto } from './dtos/update-ranking.dto';
import { ClientproxyRmqService } from '../client-proxy-rmq/client-proxy-rmq.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { RankingRepository } from './repository/ranking.repository';

@Injectable()
export class RankingService {
  private microAdinBakend: ClientProxy;
  private microMatch: ClientProxy;
  private readonly logger = new Logger(RankingService.name);

  constructor(
    clientProxyRmqservice: ClientproxyRmqService,
    private readonly rankingRepository: RankingRepository,
  ) {
    this.microAdinBakend =
      clientProxyRmqservice.getClientProxyRmqAdminBackend();
    this.microMatch = clientProxyRmqservice.getClientProxyRmqMicroMatch();
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

  async create(createRankingDto: CreateRankingDto) {
    // this.logger.log(createRankingDto);
    const { players } = createRankingDto;
    try {
      const rankings = players.map(async (player) => {
        return await this.rankingRepository.create({
          player: player,
          position: 0,
          score: 0,
          matchHistory: {
            defeat: 0,
            victory: 0,
          },
        });
      });
      return await Promise.all(rankings);
    } catch (error) {
      this.logError(error, this.create.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }
  async findAll() {
    try {
      return await this.rankingRepository.findAll();
    } catch (error) {
      this.logError(error, this.findAll.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const ranking = await this.rankingRepository.findOneById(id);
      if (!ranking) throw new RpcException('ranking not found');
      return ranking;
    } catch (error) {
      this.logError(error, this.findAll.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.path === '_id') throw new RpcException('Type of id invalid');

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }

  async update(id: string, updateRankingDto: UpdateRankingDto) {
    // this.logger.log({ id, updateRankingDto });
    try {
      const ranking = await this.rankingRepository.update(id, updateRankingDto);

      if (!ranking) throw new RpcException('Ranking not found');

      return ranking;
    } catch (error) {
      this.logError(error, this.findAll.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.path === '_id') throw new RpcException('Type of id invalid');

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }

  async delete(id: string) {}
}
