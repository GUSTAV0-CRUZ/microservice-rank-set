import { Injectable, Logger } from '@nestjs/common';
import { CreateRankingDto } from './dtos/create-ranking.dto';
import { UpdateRankingDto } from './dtos/update-ranking.dto';
import { ClientproxyRmqService } from '../client-proxy-rmq/client-proxy-rmq.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { RankingRepository } from './repository/ranking.repository';
import { ModifyPerMatchDto } from './dtos/modify-per-match.dto';
import { lastValueFrom } from 'rxjs';
import { EventsNameEnum } from './enums/events-name.enum';
import { Ranking } from './entities/Ranking';

@Injectable()
export class RankingService {
  private microAdinBakend: ClientProxy;
  private readonly logger = new Logger(RankingService.name);

  constructor(
    clientProxyRmqservice: ClientproxyRmqService,
    private readonly rankingRepository: RankingRepository,
  ) {
    this.microAdinBakend =
      clientProxyRmqservice.getClientProxyRmqAdminBackend();
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
      this.logError(error, this.update.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.path === '_id') throw new RpcException('Type of id invalid');

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }

  async delete(id: string) {
    try {
      const ranking = await this.rankingRepository.delete(id);

      if (!ranking) throw new RpcException('Ranking not found');

      return ranking;
    } catch (error) {
      this.logError(error, this.delete.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.path === '_id') throw new RpcException('Type of id invalid');

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }

  calculationScore(valueExistent: number, valueForOperation: number) {
    return {
      '-': (): number =>
        valueExistent - valueForOperation < 0
          ? 0
          : valueExistent - valueForOperation,
      '+': (): number => valueExistent + valueForOperation,
      '*': (): number => valueExistent * valueForOperation,
      '/': (): number => valueExistent / valueForOperation,
    };
  }

  async modifyPerMatch(modifyPerMatchDto: ModifyPerMatchDto) {
    // this.logger.log(modifyPerMatchDto);
    const { players, category, def } = modifyPerMatchDto;
    try {
      const rankingsOfPlayersPromise = players.map(async (playerId) => {
        const rankingPerPlayer: unknown =
          await this.rankingRepository.findOneByIdPlayer(playerId);

        if (!rankingPerPlayer) {
          const createRankingPerPlayer = await this.create({
            players: [playerId],
          });
          return createRankingPerPlayer[0];
        }

        return rankingPerPlayer as Ranking;
      });

      const rankingsOfPlayers = await Promise.all(rankingsOfPlayersPromise);

      const categorySelected = await lastValueFrom<{
        events: [
          {
            name: EventsNameEnum;
            value: number;
            operation: string;
          },
        ];
      }>(this.microAdinBakend.send('findOneById-category', category));

      const playerWinning =
        rankingsOfPlayers[0]['player'] === def
          ? rankingsOfPlayers[0]
          : rankingsOfPlayers[1];

      const playerLosing =
        rankingsOfPlayers[0]['player'] !== def
          ? rankingsOfPlayers[0]
          : rankingsOfPlayers[1];

      const eventVictoryLeader = categorySelected.events.filter(
        (event) => event.name === EventsNameEnum.VICTORY_LEADER,
      )[0];

      const eventVictory = categorySelected.events.filter(
        (event) => event.name === EventsNameEnum.VICTORY,
      )[0];

      const eventDefeat = categorySelected.events.filter(
        (event) => event.name === EventsNameEnum.DEFEAT,
      )[0];

      const eventWinning =
        playerLosing.position === 1 ? eventVictoryLeader : eventVictory;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const scoreWinning = this.calculationScore(
        playerWinning.score,
        eventWinning.value,
      )[eventWinning.operation]() as number;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const scoreLosing = this.calculationScore(
        playerLosing.score,
        eventDefeat.value,
      )[eventDefeat.operation]() as number;

      const playerWinningUpdate: UpdateRankingDto = {
        score: scoreWinning,
        position: 0,
        matchHistory: {
          victory: (playerWinning.matchHistory.victory += 1),
          defeat: playerWinning.matchHistory.defeat,
        },
      };

      const playerLosingUpdate: UpdateRankingDto = {
        score: scoreLosing,
        position: 0,
        matchHistory: {
          victory: playerLosing.matchHistory.victory,
          defeat: (playerLosing.matchHistory.defeat += 1),
        },
      };

      await Promise.all([
        this.update(String(playerWinning['_id']), playerWinningUpdate),
        this.update(String(playerLosing['_id']), playerLosingUpdate),
      ]);

      const rankinsSortScore: unknown =
        await this.rankingRepository.findPerScoreDesc();
      await this.rankingRepository.updateAllPositions(
        rankinsSortScore as Ranking[],
      );

      return (await rankinsSortScore) as Ranking[];
    } catch (error) {
      this.logError(error, this.modifyPerMatch.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.path === '_id') throw new RpcException('Type of id invalid');

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }
}
