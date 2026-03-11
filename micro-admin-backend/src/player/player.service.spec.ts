/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { PlayerRepository } from './repository/player.repository';
import { createPlayer } from '../utils/player/create-player';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PlayerService', () => {
  let playerService: PlayerService;
  let playerRepository: PlayerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: PlayerRepository,
          useValue: {
            findAll: jest.fn(),
            findOneId: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    playerService = module.get<PlayerService>(PlayerService);
    playerRepository = module.get<PlayerRepository>(PlayerRepository);
  });

  it('should be defined', () => {
    expect(playerService).toBeDefined();
  });

  describe('findAll', () => {
    it('Should return array of players', async () => {
      const arrayPlayer = [createPlayer()];
      jest
        .spyOn(playerRepository, 'findAll')
        .mockResolvedValue(arrayPlayer as any);

      const result = await playerService.findAll({});

      expect(playerRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(arrayPlayer);
    });
  });

  describe('findOne', () => {
    it('Should return one player', async () => {
      const player = createPlayer();
      const id = 'uhdcsush324';
      jest
        .spyOn(playerRepository, 'findOneId')
        .mockResolvedValue(player as any);

      const result = await playerService.findOne(id);

      expect(playerRepository.findOneId).toHaveBeenCalledWith(id);
      expect(result).toEqual(player);
    });

    it('Should return the error "Player not found"', async () => {
      jest.spyOn(playerRepository, 'findOneId').mockResolvedValue(null);
      await expect(playerService.findOne('1a2b3c')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('Should return the error "Type of id invalid"', async () => {
      const errorImplementKey = new NotFoundException();
      errorImplementKey['path'] = '_id';

      jest.spyOn(playerRepository, 'findOneId').mockImplementationOnce(() => {
        throw errorImplementKey;
      });
      await expect(playerService.findOne('1a2b3c')).rejects.toThrow(
        'Type of id invalid',
      );
    });

    it('Should return the error "BadRequestException"', async () => {
      jest.spyOn(playerRepository, 'findOneId').mockRejectedValue(new Error());
      await expect(playerService.findOne('1a2b3c')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('create', () => {
    it('Should return new Player', async () => {
      const player = createPlayer();
      const idGenereted = '3672ihr23t6723y26';

      jest.spyOn(playerRepository, 'create').mockResolvedValue({
        _id: idGenereted,
        ...player,
      } as any);

      const result = await playerService.create(player);

      expect(playerRepository.create).toHaveBeenCalledWith(player);
      expect(result).toEqual({
        _id: idGenereted,
        ...player,
      });
    });

    it('Should return the error "Value of key tell is duplicate"', async () => {
      const errorImplementKey = new BadRequestException();
      errorImplementKey['keyPattern'] = { tell: 1 };

      jest.spyOn(playerRepository, 'create').mockImplementationOnce(() => {
        throw errorImplementKey;
      });
      await expect(playerService.create({} as any)).rejects.toThrow(
        'Value of key tell is duplicate',
      );
    });

    it('Should return the error "Value of key email is duplicate"', async () => {
      const errorImplementKey = new BadRequestException();
      errorImplementKey['keyPattern'] = { email: 1 };

      jest.spyOn(playerRepository, 'create').mockImplementationOnce(() => {
        throw errorImplementKey;
      });
      await expect(playerService.create({} as any)).rejects.toThrow(
        'Value of key email is duplicate',
      );
    });

    it('Should return the error "BadRequestException"', async () => {
      jest.spyOn(playerRepository, 'create').mockRejectedValue(new Error());
      await expect(playerService.create({} as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('Should return Player updated', async () => {
      const player = createPlayer();
      const playerUpdated = { name: 'Name Updatede' };
      const id = '3672ihr23t6723y26';

      jest.spyOn(playerRepository, 'update').mockResolvedValue({
        ...player,
        ...playerUpdated,
      } as any);

      const result = await playerService.update(id, playerUpdated);

      expect(playerRepository.update).toHaveBeenCalledWith(id, playerUpdated);
      expect(result).toEqual({
        ...player,
        ...playerUpdated,
      });
    });

    it('Should return the error "Player not found"', async () => {
      jest.spyOn(playerRepository, 'update').mockResolvedValue(null);
      await expect(playerService.update('', {} as any)).rejects.toThrow(
        'Player not found',
      );
    });

    it('Should return the error "Type of id invalid"', async () => {
      const errorImplementKey = new NotFoundException();
      errorImplementKey['path'] = '_id';

      jest.spyOn(playerRepository, 'update').mockImplementationOnce(() => {
        throw errorImplementKey;
      });
      await expect(playerService.update('', {} as any)).rejects.toThrow(
        'Type of id invalid',
      );
    });

    it('Should return the error "BadRequestException"', async () => {
      jest.spyOn(playerRepository, 'update').mockRejectedValue(new Error());
      await expect(playerService.update('', {} as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('delete', () => {
    it('Should return Player deleted', async () => {
      const player = createPlayer();
      const id = '3672ihr23t6723y26';

      jest.spyOn(playerRepository, 'delete').mockReturnValue(player as any);

      const result = await playerService.delete(id);

      expect(playerRepository.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(player);
    });

    it('Should return the error "Error to delete player"', async () => {
      jest.spyOn(playerRepository, 'delete').mockResolvedValue(null);
      await expect(playerService.delete('')).rejects.toThrow(
        'Player not found',
      );
    });

    it('Should return the error "BadRequestException"', async () => {
      jest.spyOn(playerRepository, 'delete').mockRejectedValue(new Error());
      await expect(playerService.delete('')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('Should return the error "Type of id invalid"', async () => {
      const errorImplementKey = new NotFoundException();
      errorImplementKey['path'] = '_id';

      jest.spyOn(playerRepository, 'delete').mockImplementationOnce(() => {
        throw errorImplementKey;
      });
      await expect(playerService.delete('')).rejects.toThrow(
        'Type of id invalid',
      );
    });
  });
});
