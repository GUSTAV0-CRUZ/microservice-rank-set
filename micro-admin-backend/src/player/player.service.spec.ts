/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { PlayerRepository } from './repository/player.repository';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { RpcException } from '@nestjs/microservices';
const createPlayer = (id?: string) => ({ name: 'test', id: id ? id : 'Id123' });
describe('PlayerService', () => {
  let playerService: PlayerService;
  let playerRepository: PlayerRepository;
  let cloudinaryService: CloudinaryService;

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
        {
          provide: CloudinaryService,
          useValue: {
            uploadedFile: jest.fn(),
          },
        },
      ],
    }).compile();

    playerService = module.get<PlayerService>(PlayerService);
    playerRepository = module.get<PlayerRepository>(PlayerRepository);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
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
      const id = 'uhdcsush324';
      const player = createPlayer(id);
      jest
        .spyOn(playerRepository, 'findOneId')
        .mockResolvedValue(player as any);

      const result = await playerService.findOne(id);

      expect(playerRepository.findOneId).toHaveBeenCalledWith(id);
      expect(result).toEqual({ ...player, id });
    });

    it('Should return the error "Player not found"', async () => {
      jest.spyOn(playerRepository, 'findOneId').mockResolvedValue(null);
      await expect(playerService.findOne('iD1a2b3c')).rejects.toThrow(
        'Player with id: iD1a2b3c not found',
      );
    });

    it('Should return the error "Type of id invalid"', async () => {
      const errorImplementKey = new Error();
      errorImplementKey.message =
        'messageAleatory Cast to ObjectId failed for value messageAleatory';

      jest.spyOn(playerRepository, 'findOneId').mockImplementationOnce(() => {
        throw errorImplementKey;
      });
      await expect(playerService.findOne('1a2b3c')).rejects.toThrow(
        'Type of id invalid',
      );
    });

    it('Should return the error "RpcException"', async () => {
      jest.spyOn(playerRepository, 'findOneId').mockRejectedValue(new Error());
      await expect(playerService.findOne('1a2b3c')).rejects.toThrow(
        RpcException,
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

      const result = await playerService.create(player as any);

      expect(playerRepository.create).toHaveBeenCalledWith(player);
      expect(result).toEqual({
        _id: idGenereted,
        ...player,
      });
    });

    it('Should return the error "Value of key tell is duplicate"', async () => {
      const errorImplementKey = new Error();
      errorImplementKey.message = 'aleatory message dup key: { tell: 1 }';

      jest.spyOn(playerRepository, 'create').mockImplementationOnce(() => {
        throw errorImplementKey;
      });
      await expect(playerService.create({} as any)).rejects.toThrow(
        'Value of key tell is duplicate',
      );
    });

    it('Should return the error "Value of key email is duplicate"', async () => {
      const errorImplementKey = new Error();
      errorImplementKey.message = 'aleatory message dup key: { email: 1 }';

      jest.spyOn(playerRepository, 'create').mockImplementationOnce(() => {
        throw errorImplementKey;
      });
      await expect(playerService.create({} as any)).rejects.toThrow(
        'Value of key email is duplicate',
      );
    });

    it('Should return the error "RpcException"', async () => {
      jest.spyOn(playerRepository, 'create').mockRejectedValue(new Error());
      await expect(playerService.create({} as any)).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('update', () => {
    it('Should return Player updated', async () => {
      const id = '3672ihr23t6723y26';
      const player = createPlayer(id);
      const playerUpdated = { name: 'Name Updatede' };

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
      const errorImplementKey = new Error();
      errorImplementKey['path'] = '_id';

      jest.spyOn(playerRepository, 'update').mockImplementationOnce(() => {
        throw errorImplementKey;
      });
      await expect(playerService.update('', {} as any)).rejects.toThrow(
        'Type of id invalid',
      );
    });

    it('Should return the error "RpcException"', async () => {
      jest.spyOn(playerRepository, 'update').mockRejectedValue(new Error());
      await expect(playerService.update('', {} as any)).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('delete', () => {
    it('Should return Player deleted', async () => {
      const id = '3672ihr23t6723y26';
      const player = createPlayer(id);

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

    it('Should return the error "RpcException"', async () => {
      jest.spyOn(playerRepository, 'delete').mockRejectedValue(new Error());
      await expect(playerService.delete('')).rejects.toThrow(RpcException);
    });

    it('Should return the error "Type of id invalid"', async () => {
      const errorImplementKey = new Error();
      errorImplementKey['path'] = '_id';

      jest.spyOn(playerRepository, 'delete').mockImplementationOnce(() => {
        throw errorImplementKey;
      });
      await expect(playerService.delete('')).rejects.toThrow(
        'Type of id invalid',
      );
    });
  });

  describe('uploadedImage', () => {
    it('Should return Player with pictureUrl updated', async () => {
      const id = '3672ihr23t6723y26';
      const player = createPlayer(id);
      const fileName = `${id}-imageProfile`;

      jest.spyOn(cloudinaryService, 'uploadedFile').mockResolvedValue({
        url: 'anyUrl',
      } as any);

      jest.spyOn(playerService, 'update').mockResolvedValue({
        ...player,
        pictureUrl: fileName,
      } as any);

      const result = await playerService.uploadedImage(id, {} as any);

      expect(cloudinaryService.uploadedFile).toHaveBeenCalledWith(
        {} as any,
        fileName as any,
      );
      expect(playerService.update).toHaveBeenCalledWith(id, {
        pictureUrl: 'anyUrl',
      } as any);
      expect(result).toEqual({ ...player, pictureUrl: fileName });
    });

    it('Should return the error "RpcException" in fail the method uploadedFile', async () => {
      jest
        .spyOn(cloudinaryService, 'uploadedFile')
        .mockRejectedValue(new Error());
      await expect(
        playerService.uploadedImage('' as any, {} as any),
      ).rejects.toThrow(RpcException);
    });

    it('Should return the error "RpcException" in fail the method update', async () => {
      jest.spyOn(playerService, 'update').mockRejectedValue(new Error());
      await expect(playerService.uploadedImage('', {} as any)).rejects.toThrow(
        RpcException,
      );
    });

    it('Should return the error "Type of id invalid"', async () => {
      const errorImplementKey = new Error();
      errorImplementKey['path'] = '_id';

      jest.spyOn(cloudinaryService, 'uploadedFile').mockResolvedValue({
        url: 'anyUrl',
      } as any);
      jest.spyOn(playerRepository, 'update').mockImplementationOnce(() => {
        throw errorImplementKey;
      });
      await expect(playerService.uploadedImage('', {} as any)).rejects.toThrow(
        'Type of id invalid',
      );
    });
  });
});
