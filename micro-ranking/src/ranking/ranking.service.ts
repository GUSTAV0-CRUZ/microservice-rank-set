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

  private calculationScore(valueExistent: number, valueForOperation: number) {
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

  private eventOfCategoryPerEventsNameEnum(
    category: { events: [{ name: string; value: number; operation: string }] },
    eventsNameEnum: EventsNameEnum,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    return category.events.filter((event) => event.name === eventsNameEnum)[0];
  }

  private factoryPlayerWinningOrLosing(
    select: 'Winning' | 'Losing',
    rankingsOfPlayers: Array<Ranking>,
    def: string,
  ) {
    return rankingsOfPlayers[0]['player'] === def
      ? rankingsOfPlayers[select === 'Winning' ? 0 : 1]
      : rankingsOfPlayers[select === 'Winning' ? 1 : 0];
  }

  private factoryPlayerWinningOrLosingForUpdate(
    select: 'Winning' | 'Losing',
    score: number,
    rankingPlayer: Ranking,
  ) {
    return {
      score,
      position: 0,
      matchHistory: {
        victory: (rankingPlayer.matchHistory.victory +=
          select === 'Winning' ? 1 : 0),
        defeat: (rankingPlayer.matchHistory.defeat +=
          select === 'Losing' ? 1 : 0),
      },
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

      const rankingsOfPlayers = (await Promise.all(
        rankingsOfPlayersPromise,
      )) as Array<Ranking>;

      const categorySelected = await lastValueFrom<{
        events: [
          {
            name: EventsNameEnum;
            value: number;
            operation: string;
          },
        ];
      }>(this.microAdinBakend.send('findOneById-category', category));

      const rankingOfPlayerWinning = this.factoryPlayerWinningOrLosing(
        'Winning',
        rankingsOfPlayers,
        def,
      );

      const rankingOfPlayerLosing = this.factoryPlayerWinningOrLosing(
        'Losing',
        rankingsOfPlayers,
        def,
      );

      const eventVictoryLeader = this.eventOfCategoryPerEventsNameEnum(
        categorySelected,
        EventsNameEnum.VICTORY_LEADER,
      );

      const eventVictory = this.eventOfCategoryPerEventsNameEnum(
        categorySelected,
        EventsNameEnum.VICTORY,
      );

      const eventDefeat = this.eventOfCategoryPerEventsNameEnum(
        categorySelected,
        EventsNameEnum.DEFEAT,
      );

      const eventWinning =
        rankingOfPlayerLosing.position === 1
          ? eventVictoryLeader
          : eventVictory;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const scoreWinning = this.calculationScore(
        rankingOfPlayerWinning.score,
        eventWinning.value,
      )[eventWinning.operation]() as number;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const scoreLosing = this.calculationScore(
        rankingOfPlayerLosing.score,
        eventDefeat.value,
      )[eventDefeat.operation]() as number;

      const rankingOfPlayerWinningUpdate: UpdateRankingDto =
        this.factoryPlayerWinningOrLosingForUpdate(
          'Winning',
          scoreWinning,
          rankingOfPlayerWinning,
        );

      const rankingOfPlayerLosingUpdate: UpdateRankingDto =
        this.factoryPlayerWinningOrLosingForUpdate(
          'Losing',
          scoreLosing,
          rankingOfPlayerLosing,
        );

      await Promise.all([
        this.update(
          String(rankingOfPlayerWinning['_id']),
          rankingOfPlayerWinningUpdate,
        ),
        this.update(
          String(rankingOfPlayerLosing['_id']),
          rankingOfPlayerLosingUpdate,
        ),
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
