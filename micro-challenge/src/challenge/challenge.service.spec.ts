/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ChallengeService } from './challenge.service';
import { ChallengeRepository } from './repository/challenge.repository';
import { ClienteProxyRmqService } from '../cliente-proxy-rmq/cliente-proxy-rmq.service';
import { of, throwError } from 'rxjs';
import { ChallengeStatus } from './enums/challenge-status.enum';
import { RpcException } from '@nestjs/microservices';
import { UpdateChallengeStatus } from './enums/update-challenge-status.enum';

const createChallenge = (
  applicant?: string,
  players?: Array<string>,
  categoryId?: string,
  dateHourChallenge?: Date,
  status?: ChallengeStatus,
) => ({
  applicant: applicant ?? 'idAplicant123',
  players: players ?? ['idOutherPlayer456', 'idAplicant123'],
  dateHourChallenge: dateHourChallenge ?? '2026-02-03T10:05:02',
  dateHourRequest: new Date(),
  status: status ?? ChallengeStatus.PENDING,
  category: categoryId ?? 'anyIdCategory',
});

const createPlayer = (id?: string, name?: string, email?: string) => ({
  id: id ?? 'anyId',
  email: email ?? 'anyEmail',
  name: name ?? 'anyName',
});

const createCategory = () => ({ name: 'anyName', _id: 'anyId123' });

const createMatch = () => ({ name: 'anyName', _id: 'anyId123' });

describe('ChallengeService', () => {
  let challengeService: ChallengeService;
  let challengeRepository: ChallengeRepository;

  const microBackendClientProxy = {
    send: jest.fn(),
    emit: jest.fn(),
  };

  const microMatchClientProxy = {
    send: jest.fn(),
    emit: jest.fn(),
  };

  const microRankingClientProxy = {
    send: jest.fn(),
    emit: jest.fn(),
  };

  const microSendEmailClientProxy = {
    send: jest.fn(),
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengeService,
        {
          provide: ChallengeRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneId: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
            findChallengesByIdPlayer: jest.fn(),
            addMatch: jest.fn(),
          },
        },
        {
          provide: ClienteProxyRmqService,
          useValue: {
            getClientProxyRmqAdminBackend: () => microBackendClientProxy,
            getClientProxyRmqMicroMatch: () => microMatchClientProxy,
            getClientProxyRmqMicroRanking: () => microRankingClientProxy,
            getClientProxyRmqMicroSendEmail: () => microSendEmailClientProxy,
          },
        },
      ],
    }).compile();

    challengeService = module.get<ChallengeService>(ChallengeService);
    challengeRepository = module.get<ChallengeRepository>(ChallengeRepository);
  });

  it('should be defined', () => {
    expect(challengeService).toBeDefined();
  });

  describe('create', () => {
    it('Should return new Challenge', async () => {
      const player1 = createPlayer('IdPlayer1', 'p1', '1@test.com');
      const player2 = createPlayer('IdPlayer2', 'p2', '2@test.com');
      const category = createCategory();
      const challengeCreate = {
        players: ['IdPlayer1', 'IdPlayer2'],
        applicant: 'IdPlayer1',
        dateHourChallenge: '2026-02-03T10:05:02',
      };
      const challenge = createChallenge(
        challengeCreate.applicant,
        challengeCreate.players,
        category._id,
        challengeCreate.dateHourChallenge as any,
      );

      jest
        .spyOn(microBackendClientProxy, 'send')
        .mockReturnValueOnce(of(player1 as any))
        .mockReturnValueOnce(of(player2 as any))
        .mockReturnValueOnce(of(category as any));

      jest
        .spyOn(challengeRepository, 'create')
        .mockResolvedValue(challenge as any);

      jest.spyOn(microSendEmailClientProxy, 'emit');

      const result = await challengeService.create(challengeCreate as any);

      expect(microBackendClientProxy.send).toHaveBeenNthCalledWith(
        1,
        'findOneById-player',
        challengeCreate.players[0],
      );
      expect(microBackendClientProxy.send).toHaveBeenNthCalledWith(
        2,
        'findOneById-player',
        challengeCreate.players[1],
      );
      expect(microBackendClientProxy.send).toHaveBeenNthCalledWith(
        3,
        'findCategoryContainPlayerId-category',
        challengeCreate.applicant,
      );
      expect(challengeRepository.create).toHaveBeenCalledWith({
        ...challengeCreate,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        dateHourRequest: expect.any(Date),
        status: ChallengeStatus.PENDING,
        category: category['_id'],
      });
      expect(microSendEmailClientProxy.emit).toHaveBeenNthCalledWith(
        1,
        'send-message',
        {
          from: player1.email,
          to: player2.email,
          applicantName: player1.name,
          challengedName: player2.name,
        },
      );
      expect(result).toEqual({
        ...challengeCreate,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        dateHourRequest: expect.any(Date),
        status: ChallengeStatus.PENDING,
        category: category['_id'],
      });
    });

    it('Should return the error "Applicant not is one player of challenge"', async () => {
      const challengeCreate = {
        players: ['IdPlayer1', 'IdPlayer2'],
        applicant: 'IdPlayer3',
        dateHourChallenge: '2026-02-03T10:05:02',
      };

      jest.spyOn(microBackendClientProxy, 'send').mockReturnValue(of({}));

      await expect(
        challengeService.create(challengeCreate as any),
      ).rejects.toThrow('Applicant not is one player of challenge');
    });

    it('Should return an error if the lastValueFrom fails', async () => {
      jest
        .spyOn(microBackendClientProxy, 'send')
        .mockReturnValueOnce(throwError(() => new Error('fail')))
        .mockReturnValueOnce(of({}))
        .mockReturnValueOnce(of({}));

      await expect(challengeService.create({} as any)).rejects.toThrow(
        RpcException,
      );
    });

    it('Should return the error generic "RpcException"', async () => {
      jest.spyOn(challengeRepository, 'create').mockRejectedValue(new Error());
      await expect(challengeService.create({} as any)).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('findAll', () => {
    it('Should return array of Challenge', async () => {
      const arrayChallenge = [createChallenge()];
      jest
        .spyOn(challengeRepository, 'findAll')
        .mockResolvedValue(arrayChallenge as any);

      const result = await challengeService.findAll();

      expect(challengeRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(arrayChallenge);
    });

    it('Should return one generic error', async () => {
      jest.spyOn(challengeRepository, 'findAll').mockRejectedValue(new Error());

      await expect(challengeService.findAll()).rejects.toThrow(RpcException);
    });
  });

  describe('findOne', () => {
    it('Should return one challenge', async () => {
      const id = 'idOfChallenge123';
      const challenge = createChallenge();

      jest
        .spyOn(challengeRepository, 'findOneId')
        .mockResolvedValue(challenge as any);

      const result = await challengeService.findOne(id);

      expect(challengeRepository.findOneId).toHaveBeenCalledWith(id);
      expect(result).toEqual(challenge);
    });

    it('Should return the error "challenge not found"', async () => {
      jest.spyOn(challengeRepository, 'findOneId').mockResolvedValue(null);
      await expect(challengeService.findOne('1a2b3c')).rejects.toThrow(
        'Challenge not found',
      );
    });

    it('Should return the error "Type of id invalid"', async () => {
      const errorImplementKey = new Error();
      errorImplementKey['path'] = '_id';

      jest
        .spyOn(challengeRepository, 'findOneId')
        .mockImplementationOnce(() => {
          throw errorImplementKey;
        });
      await expect(challengeService.findOne('')).rejects.toThrow(
        'Type of id invalid',
      );
    });

    it('Should return the generic error "RpcException"', async () => {
      jest
        .spyOn(challengeRepository, 'findOneId')
        .mockRejectedValue(new Error());
      await expect(challengeService.findOne('1a2b3c')).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('update', () => {
    it('Should return challenge updated', async () => {
      const challenge = createChallenge();
      const challengeUpdated = {
        dateHourResponse: new Date(),
        status: UpdateChallengeStatus.ACCEPTED,
      };
      const id = '3672ihr23t6723y26';

      jest
        .spyOn(challengeService, 'findOne')
        .mockResolvedValue(challenge as any);

      jest.spyOn(challengeRepository, 'update').mockResolvedValue({
        ...challenge,
        ...challengeUpdated,
      } as any);

      const result = await challengeService.update(id, challengeUpdated as any);

      expect(challengeRepository.update).toHaveBeenCalledWith(
        id,
        challengeUpdated,
      );
      expect(result).toEqual({
        ...challenge,
        ...challengeUpdated,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        dateHourResponse: expect.any(Date),
      });
    });

    it('Should return the error "challenge not found"', async () => {
      jest.spyOn(challengeRepository, 'update').mockResolvedValue(null);
      await expect(challengeService.update('', {} as any)).rejects.toThrow(
        'Challenge not found',
      );
    });

    it('Should return the error "Type of id invalid"', async () => {
      const errorImplementKey = new Error();
      errorImplementKey['path'] = '_id';

      jest
        .spyOn(challengeService, 'findOne')
        .mockResolvedValue(createChallenge() as any);

      jest.spyOn(challengeRepository, 'update').mockImplementationOnce(() => {
        throw errorImplementKey;
      });
      await expect(challengeService.update('', {} as any)).rejects.toThrow(
        'Type of id invalid',
      );
    });

    it('Should return the error "the Status of Challenge should is "PENDING"... ', async () => {
      const errorImplementKey = new Error();
      errorImplementKey['path'] = '_id';

      jest
        .spyOn(challengeService, 'findOne')
        .mockResolvedValue({ status: ChallengeStatus.ACCEPTED } as any);

      await expect(challengeService.update('', {} as any)).rejects.toThrow(
        'The Status of Challenge should is "PENDING" for updateded',
      );
    });

    it('Should return the generic error "RpcException"', async () => {
      jest.spyOn(challengeRepository, 'update').mockRejectedValue(new Error());
      await expect(challengeService.update('', {} as any)).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('delete', () => {
    it('Should return challenge deleted', async () => {
      const challenge = createChallenge();
      const id = '3672ihr23t6723y26';

      jest
        .spyOn(challengeRepository, 'delete')
        .mockReturnValue(challenge as any);

      const result = await challengeService.delete(id);

      expect(challengeRepository.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(challenge);
    });

    it('Should return the error "challenge not found"', async () => {
      jest.spyOn(challengeRepository, 'delete').mockResolvedValue(null);
      await expect(challengeService.delete('idTeste123')).rejects.toThrow(
        'Challenge not found',
      );
    });

    it('Should return the error "Type of id invalid"', async () => {
      const errorImplementKey = new Error();
      errorImplementKey['path'] = '_id';

      jest.spyOn(challengeRepository, 'delete').mockImplementationOnce(() => {
        throw errorImplementKey;
      });
      await expect(challengeService.delete('')).rejects.toThrow(
        'Type of id invalid',
      );
    });

    it('Should return the error "RpcException"', async () => {
      jest.spyOn(challengeRepository, 'delete').mockRejectedValue(new Error());
      await expect(challengeService.delete('')).rejects.toThrow(RpcException);
    });
  });

  describe('findChallengesByIdPlayer', () => {
    it('Should return one challenge', async () => {
      const id = 'idOfPlayer123';
      const challenge = createChallenge();

      jest
        .spyOn(challengeRepository, 'findChallengesByIdPlayer')
        .mockResolvedValue(challenge as any);

      const result = await challengeService.findChallengesByIdPlayer(id);

      expect(challengeRepository.findChallengesByIdPlayer).toHaveBeenCalledWith(
        id,
      );
      expect(result).toEqual(challenge);
    });

    it('Should return the error "challenge not found"', async () => {
      jest
        .spyOn(challengeRepository, 'findChallengesByIdPlayer')
        .mockResolvedValue(null as any);
      await expect(
        challengeService.findChallengesByIdPlayer('1a2b3c'),
      ).rejects.toThrow('Challenge not found');
    });

    it('Should return the error "Type of id invalid"', async () => {
      const errorImplementKey = new Error();
      errorImplementKey['path'] = '_id';

      jest
        .spyOn(challengeRepository, 'findChallengesByIdPlayer')
        .mockImplementationOnce(() => {
          throw errorImplementKey;
        });
      await expect(
        challengeService.findChallengesByIdPlayer('1a2b3c'),
      ).rejects.toThrow('Type of id invalid');
    });

    it('Should return the generic error "RpcException"', async () => {
      jest
        .spyOn(challengeRepository, 'findChallengesByIdPlayer')
        .mockRejectedValue(new Error());
      await expect(
        challengeService.findChallengesByIdPlayer('1a2b3c'),
      ).rejects.toThrow(RpcException);
    });
  });

  describe('addMatch', () => {
    it('Should return challenge with match and status updatede', async () => {
      const id = 'IdChallenge123';
      const challenge = createChallenge(
        undefined,
        undefined,
        undefined,
        undefined,
        ChallengeStatus.ACCEPTED,
      );
      const dto = {
        result: [
          {
            set: '3-0',
          },
        ],
        def: challenge.players[0],
      };
      const match = createMatch();

      jest
        .spyOn(challengeService, 'findOne')
        .mockResolvedValue(challenge as any);

      jest.spyOn(microMatchClientProxy, 'send').mockReturnValue(of(match));

      jest.spyOn(challengeRepository, 'addMatch').mockResolvedValue({
        ...challenge,
        match: match._id,
        status: ChallengeStatus.ACCOMPLISHED,
      } as any);

      jest.spyOn(microRankingClientProxy, 'emit');

      const result = await challengeService.addMatch(id, dto as any);

      expect(challengeService.findOne).toHaveBeenCalledWith(id);
      expect(microMatchClientProxy.send).toHaveBeenNthCalledWith(
        1,
        'create-match',
        {
          category: challenge.category,
          players: challenge.players,
          def: dto.def,
          result: dto.result,
          challenge,
        },
      );
      expect(challengeRepository.addMatch).toHaveBeenCalledWith(id, {
        match,
        status: ChallengeStatus.ACCOMPLISHED,
      });
      expect(microRankingClientProxy.emit).toHaveBeenNthCalledWith(
        1,
        'modifyPerMatch-ranking',
        {
          category: challenge.category,
          players: challenge.players,
          def: dto.def,
        },
      );
      expect(result).toEqual({
        ...challenge,
        match: match._id,
        status: ChallengeStatus.ACCOMPLISHED,
      });
    });

    it('Should return the error Status of challenge should is "ACCEPTED"', async () => {
      const challenge = createChallenge();
      jest
        .spyOn(challengeService, 'findOne')
        .mockResolvedValue(challenge as any);

      await expect(challengeService.addMatch('', {} as any)).rejects.toThrow(
        'Status of challenge should is "ACCEPTED"',
      );
    });

    it('Should return the error: def not player of challenge', async () => {
      const challenge = createChallenge(
        undefined,
        undefined,
        undefined,
        undefined,
        ChallengeStatus.ACCEPTED,
      );
      jest
        .spyOn(challengeService, 'findOne')
        .mockResolvedValue(challenge as any);

      await expect(
        challengeService.addMatch('', { def: 'idDef123' } as any),
      ).rejects.toThrow('def not player of challenge');
    });

    it('Should return the error: Object of challenge is empity', async () => {
      const challenge = createChallenge(
        undefined,
        undefined,
        undefined,
        undefined,
        ChallengeStatus.ACCEPTED,
      );
      jest
        .spyOn(challengeService, 'findOne')
        .mockResolvedValue(challenge as any);

      jest.spyOn(challengeRepository, 'addMatch').mockResolvedValue(null);

      await expect(
        challengeService.addMatch('', { def: challenge.applicant } as any),
      ).rejects.toThrow('Object of challenge is empity');
    });

    it('Should return the generic error "RpcException"', async () => {
      jest
        .spyOn(challengeRepository, 'addMatch')
        .mockRejectedValue(new Error());
      await expect(challengeService.addMatch('', {} as any)).rejects.toThrow(
        RpcException,
      );
    });
  });
});
