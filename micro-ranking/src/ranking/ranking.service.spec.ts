/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { RankingService } from './ranking.service';
import { RankingRepository } from './repository/ranking.repository';
import { ClientproxyRmqService } from '../client-proxy-rmq/client-proxy-rmq.service';
import { RpcException } from '@nestjs/microservices';
import { EventsNameEnum } from './enums/events-name.enum';
import { of } from 'rxjs';

const createRanking = (player?: string, score?: number, position?: number) => ({
  _id: 'anyId',
  player: player ?? 'player1',
  score: score ?? 0,
  position: position ?? 0,
  matchHistory: {
    victory: 0,
    defeat: 0,
  },
});

const createCategory = () => ({
  events: [
    {
      name: EventsNameEnum.VICTORY,
      value: 10,
      operation: '+',
    },
    {
      name: EventsNameEnum.VICTORY_LEADER,
      value: 20,
      operation: '+',
    },
    {
      name: EventsNameEnum.DEFEAT,
      value: 5,
      operation: '-',
    },
  ],
});

describe('RankingService', () => {
  let rankingService: RankingService;
  let rankingRepository: RankingRepository;

  const microAdinBakend = {
    send: jest.fn(),
    emit: jest.fn(),
  };

  const microMatch = {
    send: jest.fn(),
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RankingService,
        {
          provide: RankingRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn(),
            findOneByIdPlayer: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findPerScoreDesc: jest.fn(),
            updateAllPositions: jest.fn(),
          },
        },
        {
          provide: ClientproxyRmqService,
          useValue: {
            getClientProxyRmqAdminBackend: () => microAdinBakend,
            getClientProxyRmqMicroMatch: () => microMatch,
          },
        },
      ],
    }).compile();

    rankingService = module.get<RankingService>(RankingService);
    rankingRepository = module.get<RankingRepository>(RankingRepository);
  });

  it('should be defined', () => {
    expect(rankingService).toBeDefined();
  });

  describe('create', () => {
    it('Should create rankings for players', async () => {
      const dto = { players: ['p1', 'p2'] };

      jest
        .spyOn(rankingRepository, 'create')
        .mockResolvedValue(createRanking() as any);

      const result = await rankingService.create(dto as any);

      expect(rankingRepository.create).toHaveBeenCalledTimes(2);
      expect(result.length).toBe(2);
    });

    it('Should return generic error "RpcException"', async () => {
      jest.spyOn(rankingRepository, 'create').mockRejectedValue(new Error());

      await expect(rankingService.create({} as any)).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('findAll', () => {
    it('Should return all rankings', async () => {
      const rankings = [createRanking()];

      jest
        .spyOn(rankingRepository, 'findAll')
        .mockResolvedValue(rankings as any);

      const result = await rankingService.findAll();

      expect(result).toEqual(rankings);
    });

    it('Should return generic error', async () => {
      jest.spyOn(rankingRepository, 'findAll').mockRejectedValue(new Error());

      await expect(rankingService.findAll()).rejects.toThrow(RpcException);
    });
  });

  describe('findOne', () => {
    it('Should return ranking', async () => {
      const ranking = createRanking();

      jest
        .spyOn(rankingRepository, 'findOneById')
        .mockResolvedValue(ranking as any);

      const result = await rankingService.findOne('id');

      expect(result).toEqual(ranking);
    });

    it('Should return "ranking not found"', async () => {
      jest.spyOn(rankingRepository, 'findOneById').mockResolvedValue(null);

      await expect(rankingService.findOne('id')).rejects.toThrow(
        'ranking not found',
      );
    });

    it('Should return "Type of id invalid"', async () => {
      const error: any = new Error();
      error.path = '_id';

      jest
        .spyOn(rankingRepository, 'findOneById')
        .mockImplementationOnce(() => {
          throw error;
        });

      await expect(rankingService.findOne('')).rejects.toThrow(
        'Type of id invalid',
      );
    });

    it('Should return generic error', async () => {
      jest
        .spyOn(rankingRepository, 'findOneById')
        .mockRejectedValue(new Error());

      await expect(rankingService.findOne('id')).rejects.toThrow(RpcException);
    });
  });

  describe('update', () => {
    it('Should update ranking', async () => {
      const ranking = createRanking();

      jest.spyOn(rankingRepository, 'update').mockResolvedValue(ranking as any);

      const result = await rankingService.update('id', {} as any);

      expect(result).toEqual(ranking);
    });

    it('Should return "Ranking not found"', async () => {
      jest.spyOn(rankingRepository, 'update').mockResolvedValue(null);

      await expect(rankingService.update('id', {} as any)).rejects.toThrow(
        'Ranking not found',
      );
    });

    it('Should return "Type of id invalid"', async () => {
      const error: any = new Error();
      error.path = '_id';

      jest.spyOn(rankingRepository, 'update').mockImplementationOnce(() => {
        throw error;
      });

      await expect(rankingService.update('', {} as any)).rejects.toThrow(
        'Type of id invalid',
      );
    });

    it('Should return generic error', async () => {
      jest.spyOn(rankingRepository, 'update').mockRejectedValue(new Error());

      await expect(rankingService.update('', {} as any)).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('delete', () => {
    it('Should delete ranking', async () => {
      const ranking = createRanking();

      jest.spyOn(rankingRepository, 'delete').mockResolvedValue(ranking as any);

      const result = await rankingService.delete('id');

      expect(result).toEqual(ranking);
    });

    it('Should return "Ranking not found"', async () => {
      jest.spyOn(rankingRepository, 'delete').mockResolvedValue(null);

      await expect(rankingService.delete('id')).rejects.toThrow(
        'Ranking not found',
      );
    });

    it('Should return "Type of id invalid"', async () => {
      const error: any = new Error();
      error.path = '_id';

      jest.spyOn(rankingRepository, 'delete').mockImplementationOnce(() => {
        throw error;
      });

      await expect(rankingService.delete('')).rejects.toThrow(
        'Type of id invalid',
      );
    });

    it('Should return generic error', async () => {
      jest.spyOn(rankingRepository, 'delete').mockRejectedValue(new Error());

      await expect(rankingService.delete('')).rejects.toThrow(RpcException);
    });
  });

  describe('modifyPerMatch', () => {
    it('Should update rankings correctly applying score rules (VICTORY)', async () => {
      const ranking1 = createRanking('p1', 10, 2);
      const ranking2 = createRanking('p2', 5, 1);
      const category = createCategory();

      const dto = {
        players: ['p1', 'p2'],
        category: 'categoryId',
        def: 'p1',
      };

      jest
        .spyOn(rankingRepository, 'findOneByIdPlayer')
        .mockResolvedValueOnce(ranking1 as any)
        .mockResolvedValueOnce(ranking2 as any);

      jest.spyOn(microAdinBakend, 'send').mockReturnValue(of(category as any));

      const updateSpy = jest
        .spyOn(rankingService, 'update')
        .mockResolvedValue({} as any);

      jest
        .spyOn(rankingRepository, 'findPerScoreDesc')
        .mockResolvedValue([ranking1, ranking2] as any);

      jest.spyOn(rankingRepository, 'updateAllPositions');

      await rankingService.modifyPerMatch(dto as any);

      expect(updateSpy).toHaveBeenNthCalledWith(
        1,
        'anyId',
        expect.objectContaining({
          score: 30,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          matchHistory: expect.objectContaining({ victory: 1 }),
        }),
      );

      expect(updateSpy).toHaveBeenNthCalledWith(
        2,
        'anyId',
        expect.objectContaining({
          score: 0,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          matchHistory: expect.objectContaining({ defeat: 1 }),
        }),
      );
    });

    it('Should apply VICTORY_LEADER correctly', async () => {
      const ranking1 = createRanking('p1', 10, 1);
      const ranking2 = createRanking('p2', 5, 2);
      const category = createCategory();

      const dto = {
        players: ['p1', 'p2'],
        category: 'categoryId',
        def: 'p2',
      };

      jest
        .spyOn(rankingRepository, 'findOneByIdPlayer')
        .mockResolvedValueOnce(ranking1 as any)
        .mockResolvedValueOnce(ranking2 as any);

      jest.spyOn(microAdinBakend, 'send').mockReturnValue(of(category as any));

      const updateSpy = jest
        .spyOn(rankingService, 'update')
        .mockResolvedValue({} as any);

      jest
        .spyOn(rankingRepository, 'findPerScoreDesc')
        .mockResolvedValue([] as any);

      jest.spyOn(rankingRepository, 'updateAllPositions');

      await rankingService.modifyPerMatch(dto as any);

      expect(updateSpy).toHaveBeenCalledWith(
        'anyId',
        expect.objectContaining({
          score: 25,
        }),
      );
    });

    it('Should create ranking only for player that does not exist', async () => {
      const ranking2 = createRanking('p2');
      const category = createCategory();

      const dto = {
        players: ['p1', 'p2'],
        category: 'categoryId',
        def: 'p1',
      };

      jest
        .spyOn(rankingRepository, 'findOneByIdPlayer')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(ranking2 as any);

      jest
        .spyOn(rankingService, 'create')
        .mockResolvedValue([createRanking('p1')] as any);

      jest.spyOn(microAdinBakend, 'send').mockReturnValue(of(category as any));

      jest.spyOn(rankingService, 'update').mockResolvedValue({} as any);

      jest
        .spyOn(rankingRepository, 'findPerScoreDesc')
        .mockResolvedValue([ranking2] as any);

      jest.spyOn(rankingRepository, 'updateAllPositions');

      const result = await rankingService.modifyPerMatch(dto as any);

      expect(rankingService.create).toHaveBeenCalledWith({
        players: ['p1'],
      });

      expect(result).toEqual([ranking2]);
    });

    it('Should create rankings for both players if none exist', async () => {
      const category = createCategory();

      const dto = {
        players: ['p1', 'p2'],
        category: 'categoryId',
        def: 'p1',
      };

      jest
        .spyOn(rankingRepository, 'findOneByIdPlayer')
        .mockResolvedValue(null);

      jest
        .spyOn(rankingService, 'create')
        .mockResolvedValue([createRanking()] as any);

      jest.spyOn(microAdinBakend, 'send').mockReturnValue(of(category as any));

      jest.spyOn(rankingService, 'update').mockResolvedValue({} as any);

      jest
        .spyOn(rankingRepository, 'findPerScoreDesc')
        .mockResolvedValue([] as any);

      jest.spyOn(rankingRepository, 'updateAllPositions');

      await rankingService.modifyPerMatch(dto as any);

      expect(rankingService.create).toHaveBeenCalledTimes(2);
    });

    it('Should return "Type of id invalid"', async () => {
      const error: any = new Error();
      error.path = '_id';

      jest
        .spyOn(rankingRepository, 'findOneByIdPlayer')
        .mockImplementationOnce(() => {
          throw error;
        });

      await expect(
        rankingService.modifyPerMatch({
          players: ['p1', 'p2'],
          category: 'categoryId',
          def: 'p1',
        } as any),
      ).rejects.toThrow('Type of id invalid');
    });

    it('Should return generic error "RpcException"', async () => {
      jest
        .spyOn(rankingRepository, 'findOneByIdPlayer')
        .mockRejectedValue(new Error());

      await expect(rankingService.modifyPerMatch({} as any)).rejects.toThrow(
        RpcException,
      );
    });
  });
});
