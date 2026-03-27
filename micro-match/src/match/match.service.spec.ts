/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { MatchService } from './match.service';
import { MatchRepository } from './repository/match.repository';
import { RpcException } from '@nestjs/microservices';

const createMatch = (
  category?: string,
  players?: Array<string>,
  def?: string,
  result?: Array<any>,
) => ({
  category: category ?? 'anyCategory',
  players: players ?? ['player1', 'player2'],
  def: def ?? 'player1',
  result: result ?? [{ set: '3-0' }],
});

describe('MatchService', () => {
  let matchService: MatchService;
  let matchRepository: MatchRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        {
          provide: MatchRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneId: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    matchService = module.get<MatchService>(MatchService);
    matchRepository = module.get<MatchRepository>(MatchRepository);
  });

  it('should be defined', () => {
    expect(matchService).toBeDefined();
  });

  describe('create', () => {
    it('Should return new match', async () => {
      const matchDto = createMatch();

      jest.spyOn(matchRepository, 'create').mockResolvedValue(matchDto as any);

      const result = await matchService.create(matchDto as any);

      expect(matchRepository.create).toHaveBeenCalledWith(matchDto);
      expect(result).toEqual(matchDto);
    });

    it('Should return the generic error "RpcException"', async () => {
      jest.spyOn(matchRepository, 'create').mockRejectedValue(new Error());

      await expect(matchService.create({} as any)).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('findAll', () => {
    it('Should return array of match', async () => {
      const arrayMatch = [createMatch()];

      jest
        .spyOn(matchRepository, 'findAll')
        .mockResolvedValue(arrayMatch as any);

      const result = await matchService.findAll();

      expect(matchRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(arrayMatch);
    });

    it('Should return the generic error "RpcException"', async () => {
      jest.spyOn(matchRepository, 'findAll').mockRejectedValue(new Error());

      await expect(matchService.findAll()).rejects.toThrow(RpcException);
    });
  });

  describe('findOne', () => {
    it('Should return one match', async () => {
      const id = 'idMatch123';
      const match = createMatch();

      jest.spyOn(matchRepository, 'findOneId').mockResolvedValue(match as any);

      const result = await matchService.findOne(id);

      expect(matchRepository.findOneId).toHaveBeenCalledWith(id);
      expect(result).toEqual(match);
    });

    it('Should return the error "Match not found"', async () => {
      jest.spyOn(matchRepository, 'findOneId').mockResolvedValue(null);

      await expect(matchService.findOne('1a2b3c')).rejects.toThrow(
        'Match not found',
      );
    });

    it('Should return the error "Type of id invalid"', async () => {
      const errorImplementKey = new Error();
      errorImplementKey['path'] = '_id';

      jest.spyOn(matchRepository, 'findOneId').mockImplementationOnce(() => {
        throw errorImplementKey;
      });

      await expect(matchService.findOne('')).rejects.toThrow(
        'Type of id invalid',
      );
    });

    it('Should return the generic error "RpcException"', async () => {
      jest.spyOn(matchRepository, 'findOneId').mockRejectedValue(new Error());

      await expect(matchService.findOne('')).rejects.toThrow(RpcException);
    });
  });

  describe('update', () => {
    it('Should return match updated', async () => {
      const id = 'id123';
      const match = createMatch();
      const matchUpdated = {
        result: [{ set: '2-1' }],
        def: 'player2',
      };

      jest.spyOn(matchRepository, 'update').mockResolvedValue({
        ...match,
        ...matchUpdated,
      } as any);

      const result = await matchService.update(id, matchUpdated as any);

      expect(matchRepository.update).toHaveBeenCalledWith(id, matchUpdated);
      expect(result).toEqual({
        ...match,
        ...matchUpdated,
      });
    });

    it('Should return the error "Match not found"', async () => {
      jest.spyOn(matchRepository, 'update').mockResolvedValue(null);

      await expect(matchService.update('', {} as any)).rejects.toThrow(
        'Match not found',
      );
    });

    it('Should return the error "Type of id invalid"', async () => {
      const errorImplementKey = new Error();
      errorImplementKey['path'] = '_id';

      jest.spyOn(matchRepository, 'update').mockImplementationOnce(() => {
        throw errorImplementKey;
      });

      await expect(matchService.update('', {} as any)).rejects.toThrow(
        'Type of id invalid',
      );
    });

    it('Should return the generic error "RpcException"', async () => {
      jest.spyOn(matchRepository, 'update').mockRejectedValue(new Error());

      await expect(matchService.update('', {} as any)).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('delete', () => {
    it('Should return match deleted', async () => {
      const id = 'id123';
      const match = createMatch();

      jest.spyOn(matchRepository, 'delete').mockResolvedValue(match as any);

      const result = await matchService.delete(id);

      expect(matchRepository.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(match);
    });

    it('Should return the error "Match not found"', async () => {
      jest.spyOn(matchRepository, 'delete').mockResolvedValue(null);

      await expect(matchService.delete('')).rejects.toThrow('Match not found');
    });

    it('Should return the error "Type of id invalid"', async () => {
      const errorImplementKey = new Error();
      errorImplementKey['path'] = '_id';

      jest.spyOn(matchRepository, 'delete').mockImplementationOnce(() => {
        throw errorImplementKey;
      });

      await expect(matchService.delete('')).rejects.toThrow(
        'Type of id invalid',
      );
    });

    it('Should return the generic error "RpcException"', async () => {
      jest.spyOn(matchRepository, 'delete').mockRejectedValue(new Error());

      await expect(matchService.delete('')).rejects.toThrow(RpcException);
    });
  });
});
