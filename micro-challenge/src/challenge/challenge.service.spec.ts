/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { ChallengeService } from './challenge.service';
import { ChallengeRepository } from './repository/challenge.repository';
import { PlayerService } from 'src/player/player.service';
import { CategoryService } from 'src/category/category.service';
import { createChallenge } from 'src/utils/challenge/create-challenge';
import { createPlayer } from 'src/utils/player/create-player';
import { createCategory } from 'src/utils/category/create-category';
import { BadRequestException } from '@nestjs/common';
import { UpdateChallengeStatus } from './enums/update-challenge-status.enum';
import { MatchService } from 'src/match/match.service';
import { createMatch } from 'src/utils/match/create-match';
import { ChallengeStatus } from './enums/challenge-status.enum';

describe('ChallengeService', () => {
  let challengeService: ChallengeService;
  let challengeRepository: ChallengeRepository;
  let playerService: PlayerService;
  let categoryService: CategoryService;
  let matchService: MatchService;

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
          provide: PlayerService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: CategoryService,
          useValue: {
            findCategoryContainPlayerId: jest.fn(),
          },
        },
        {
          provide: MatchService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    challengeService = module.get<ChallengeService>(ChallengeService);
    challengeRepository = module.get<ChallengeRepository>(ChallengeRepository);
    playerService = module.get<PlayerService>(PlayerService);
    categoryService = module.get<CategoryService>(CategoryService);
    matchService = module.get<MatchService>(MatchService);
  });

  it('should be defined', () => {
    expect(challengeService).toBeDefined();
  });

  describe('create', () => {
    it('Should return new Challenge', async () => {
      const challenge = createChallenge();
      const player = createPlayer();
      const category = createCategory();

      const challengeCreate = {
        players: ['IdPlayer1', 'IdPlayer2'],
        applicant: 'IdPlayer1',
        dateHourChallenge: '2026-02-03T10:05:02',
      };

      jest.spyOn(playerService, 'findOne').mockResolvedValue(player as any);

      jest
        .spyOn(categoryService, 'findCategoryContainPlayerId')
        .mockResolvedValue(category as any);

      jest.spyOn(challengeRepository, 'create').mockResolvedValue({
        ...challenge,
        ...challengeCreate,
      } as any);

      const result = await challengeService.create(challengeCreate as any);

      expect(playerService.findOne).toHaveBeenCalledWith(
        challengeCreate.players[0],
      );
      expect(playerService.findOne).toHaveBeenCalledWith(
        challengeCreate.players[1],
      );
      expect(categoryService.findCategoryContainPlayerId).toHaveBeenCalledWith(
        challengeCreate.applicant,
      );
      expect(challengeRepository.create).toHaveBeenCalledWith({
        ...challengeCreate,
        dateHourRequest: expect.any(Date),
        status: challenge.status,
        category: category.name,
      });
      expect(result).toEqual({
        ...challenge,
        ...challengeCreate,
      });
    });

    it('Should return the error "Applicant not is one player of challenge"', async () => {
      const challengeCreate = {
        players: ['IdPlayer1', 'IdPlayer2'],
        applicant: 'IdPlayer3',
        dateHourChallenge: '2026-02-03T10:05:02',
      };
      await expect(
        challengeService.create(challengeCreate as any),
      ).rejects.toThrow('Applicant not is one player of challenge');
    });

    it('Should return the error "BadRequestException"', async () => {
      jest.spyOn(challengeRepository, 'create').mockRejectedValue(new Error());
      await expect(challengeService.create({} as any)).rejects.toThrow(
        BadRequestException,
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
      const errorImplementKey = new BadRequestException();
      errorImplementKey['path'] = '_id';

      jest
        .spyOn(challengeRepository, 'findOneId')
        .mockImplementationOnce(() => {
          throw errorImplementKey;
        });
      await expect(challengeService.findOne('1a2b3c')).rejects.toThrow(
        'Type of id invalid',
      );
    });

    it('Should return the error "BadRequestException"', async () => {
      jest
        .spyOn(challengeRepository, 'findOneId')
        .mockRejectedValue(new Error());
      await expect(challengeService.findOne('1a2b3c')).rejects.toThrow(
        BadRequestException,
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
      const errorImplementKey = new BadRequestException();
      errorImplementKey['path'] = '_id';

      jest.spyOn(challengeRepository, 'delete').mockImplementationOnce(() => {
        throw errorImplementKey;
      });
      await expect(challengeService.delete('')).rejects.toThrow(
        'Type of id invalid',
      );
    });

    it('Should return the error "BadRequestException"', async () => {
      jest.spyOn(challengeRepository, 'delete').mockRejectedValue(new Error());
      await expect(challengeService.delete('')).rejects.toThrow(
        BadRequestException,
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
      });
    });

    it('Should return the error "challenge not found"', async () => {
      jest.spyOn(challengeRepository, 'update').mockResolvedValue(null);
      await expect(challengeService.update('', {} as any)).rejects.toThrow(
        'Challenge not found',
      );
    });

    it('Should return the error "Type of id invalid"', async () => {
      const errorImplementKey = new BadRequestException();
      errorImplementKey['path'] = '_id';

      jest.spyOn(challengeRepository, 'update').mockImplementationOnce(() => {
        throw errorImplementKey;
      });
      await expect(challengeService.update('', {} as any)).rejects.toThrow(
        'Type of id invalid',
      );
    });

    it('Should return the error "BadRequestException"', async () => {
      jest.spyOn(challengeRepository, 'update').mockRejectedValue(new Error());
      await expect(challengeService.update('', {} as any)).rejects.toThrow(
        BadRequestException,
      );
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
      const errorImplementKey = new BadRequestException();
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

    it('Should return the error "BadRequestException"', async () => {
      jest
        .spyOn(challengeRepository, 'findChallengesByIdPlayer')
        .mockRejectedValue(new Error());
      await expect(
        challengeService.findChallengesByIdPlayer('1a2b3c'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('addMatch', () => {
    it('Should return challenge with match and status updatede', async () => {
      const id = 'IdOfChallenge123';
      const dto = {
        result: [
          {
            set: 'player one wins',
          },
        ],
        def: '69a1a8f29fda1c56f912a825',
      };
      const challenge = createChallenge();
      const match = createMatch();

      jest.spyOn(challengeService, 'findOne').mockResolvedValue(challenge);
      jest.spyOn(matchService, 'create').mockResolvedValue(match);
      jest.spyOn(challengeRepository, 'addMatch').mockResolvedValue({
        ...challenge,
        ...match,
        ...dto,
      } as any);

      const result = await challengeService.addMatch(id, dto as any);

      expect(challengeService.findOne).toHaveBeenCalledWith(id);
      expect(matchService.create).toHaveBeenCalledWith({
        category: challenge.category,
        players: challenge.players,
        def: dto.def,
        result: dto.result,
        challenge,
      });
      expect(challengeRepository.addMatch).toHaveBeenCalledWith(id, {
        match,
        status: ChallengeStatus.ACCOMPLISHED,
      });
      expect(result).toEqual({
        ...challenge,
        ...match,
        ...dto,
      });
    });

    it('Should return the error "BadRequestException"', async () => {
      jest
        .spyOn(challengeRepository, 'addMatch')
        .mockRejectedValue(new Error());
      await expect(challengeService.addMatch('', {} as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
