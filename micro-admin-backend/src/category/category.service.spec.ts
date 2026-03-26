/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { CategoryRepository } from './repository/category.repository';
import { PlayerService } from '../player/player.service';
import { RpcException } from '@nestjs/microservices';
import { AddPlayerDto } from './dto/add-player.dto';
import { RemovePlayerDto } from './dto/remove-player.dto';

const createCategory = (id?: string) => ({ name: 'test', id: id ?? 'id123' });

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let categoryRepository: CategoryRepository;
  let playerService: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: CategoryRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneId: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            addPlayers: jest.fn(),
            removePlayers: jest.fn(),
            findCategoryContainPlayerId: jest.fn(),
          },
        },
        {
          provide: PlayerService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    categoryService = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<CategoryRepository>(CategoryRepository);
    playerService = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(categoryService).toBeDefined();
  });

  describe('create', () => {
    it('Should return new Category', async () => {
      const category = createCategory();

      jest
        .spyOn(categoryRepository, 'create')
        .mockResolvedValue(category as any);

      const result = await categoryService.create(category as any);

      expect(categoryRepository.create).toHaveBeenCalledWith(category);
      expect(result).toEqual(category);
    });

    it('Should return the error "Fild Required"', async () => {
      const errorImplementKey = new Error();
      errorImplementKey['message'] = 'Path any fild duplicate';

      jest.spyOn(categoryRepository, 'create').mockImplementationOnce(() => {
        throw errorImplementKey;
      });
      await expect(categoryService.create({} as any)).rejects.toThrow(
        'Fild: any fild duplicate',
      );
    });

    it('Should return the error "Value of key name is duplicate"', async () => {
      const errorImplementKey = new Error();
      errorImplementKey['code'] = 11000;

      jest.spyOn(categoryRepository, 'create').mockImplementationOnce(() => {
        throw errorImplementKey;
      });
      await expect(categoryService.create({} as any)).rejects.toThrow(
        'Value of key name is duplicate',
      );
    });

    it('Should return the error "RpcException"', async () => {
      jest.spyOn(categoryRepository, 'create').mockRejectedValue(new Error());
      await expect(categoryService.create({} as any)).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('findAll', () => {
    it('Should return array of category', async () => {
      const arrayCategory = [createCategory()];
      jest
        .spyOn(categoryRepository, 'findAll')
        .mockResolvedValue(arrayCategory as any);

      const result = await categoryService.findAll();

      expect(categoryRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(arrayCategory);
    });

    it('Should return the error "RpcException"', async () => {
      jest.spyOn(categoryRepository, 'findAll').mockRejectedValue(new Error());
      await expect(categoryService.findAll()).rejects.toThrow(RpcException);
    });
  });

  describe('findOne', () => {
    it('Should return one category', async () => {
      const id = 'uhdcsush324';
      const category = createCategory(id);

      jest
        .spyOn(categoryRepository, 'findOneId')
        .mockResolvedValue(category as any);

      const result = await categoryService.findOne(id);

      expect(categoryRepository.findOneId).toHaveBeenCalledWith(id);
      expect(result).toEqual(category);
    });

    it('Should return the error "category not found"', async () => {
      jest.spyOn(categoryRepository, 'findOneId').mockResolvedValue(null);
      await expect(categoryService.findOne('1a2b3c')).rejects.toThrow(
        RpcException,
      );
    });

    it('Should return the error "Type of id invalid"', async () => {
      const errorImplementKey = new Error();
      errorImplementKey['path'] = '_id';

      jest.spyOn(categoryRepository, 'findOneId').mockImplementationOnce(() => {
        throw errorImplementKey;
      });
      await expect(categoryService.findOne('1a2b3c')).rejects.toThrow(
        'Type of id invalid',
      );
    });

    it('Should return the error "RpcException"', async () => {
      jest
        .spyOn(categoryRepository, 'findOneId')
        .mockRejectedValue(new Error());
      await expect(categoryService.findOne('1a2b3c')).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('update', () => {
    it('Should return category updated', async () => {
      const category = createCategory();
      const categoryUpdated = { name: 'Name Updatede' };
      const id = '3672ihr23t6723y26';

      jest.spyOn(categoryRepository, 'update').mockResolvedValue({
        ...category,
        ...categoryUpdated,
      } as any);

      const result = await categoryService.update(id, categoryUpdated as any);

      expect(categoryRepository.update).toHaveBeenCalledWith(
        id,
        categoryUpdated,
      );
      expect(result).toEqual({
        ...category,
        ...categoryUpdated,
      });
    });

    it('Should return the error "category not found"', async () => {
      jest.spyOn(categoryRepository, 'update').mockResolvedValue(null);
      await expect(categoryService.update('', {} as any)).rejects.toThrow(
        'Category not found',
      );
    });

    it('Should return the error "Type of id invalid"', async () => {
      const errorImplementKey = new Error();
      errorImplementKey['path'] = '_id';

      jest.spyOn(categoryRepository, 'update').mockImplementationOnce(() => {
        throw errorImplementKey;
      });
      await expect(categoryService.update('', {} as any)).rejects.toThrow(
        'Type of id invalid',
      );
    });

    it('Should return the error "RpcException"', async () => {
      jest.spyOn(categoryRepository, 'update').mockRejectedValue(new Error());
      await expect(categoryService.update('', {} as any)).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('delete', () => {
    it('Should return Category deleted', async () => {
      const category = createCategory();
      const id = '3672ihr23t6723y26';

      jest.spyOn(categoryRepository, 'delete').mockReturnValue(category as any);

      const result = await categoryService.delete(id);

      expect(categoryRepository.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(category);
    });

    it('Should return the error "Category not found"', async () => {
      jest.spyOn(categoryRepository, 'delete').mockResolvedValue(null);
      await expect(categoryService.delete('idTeste123')).rejects.toThrow(
        'Category not found',
      );
    });

    it('Should return the error "Type of id invalid"', async () => {
      const errorImplementKey = new Error();
      errorImplementKey['path'] = '_id';

      jest.spyOn(categoryRepository, 'delete').mockImplementationOnce(() => {
        throw errorImplementKey;
      });
      await expect(categoryService.delete('')).rejects.toThrow(
        'Type of id invalid',
      );
    });

    it('Should return the error "RpcException"', async () => {
      jest.spyOn(categoryRepository, 'delete').mockRejectedValue(new Error());
      await expect(categoryService.delete('')).rejects.toThrow(RpcException);
    });
  });

  describe('addPlayer', () => {
    it('Should return Category', async () => {
      const id = '3672ihr23t6723y26';
      const addPlayers: AddPlayerDto = { addPlayers: ['idPlayerWhere'] };
      const category = createCategory();

      jest.spyOn(playerService, 'findOne').mockResolvedValue({} as any);

      jest
        .spyOn(categoryRepository, 'addPlayers')
        .mockReturnValue(category as any);

      const result = await categoryService.addPlayers(id, addPlayers);

      expect(playerService.findOne).toHaveBeenCalled();
      expect(categoryRepository.addPlayers).toHaveBeenCalledWith(
        id,
        addPlayers,
      );
      expect(result).toEqual(category);
    });

    it('Should return the error "Category not found"', async () => {
      jest.spyOn(categoryRepository, 'addPlayers').mockResolvedValue(null);
      await expect(
        categoryService.addPlayers('idTeste123', { addPlayers: [] } as any),
      ).rejects.toThrow('Category not found');
    });

    it('Should return the error "Type of id invalid"', async () => {
      const errorImplementKey = new Error();
      errorImplementKey['path'] = '_id';

      jest
        .spyOn(categoryRepository, 'addPlayers')
        .mockImplementationOnce(() => {
          throw errorImplementKey;
        });
      await expect(
        categoryService.addPlayers('', { addPlayers: [] } as any),
      ).rejects.toThrow('Type of id invalid');
    });

    it('Should return the error "RpcException"', async () => {
      jest
        .spyOn(categoryRepository, 'addPlayers')
        .mockRejectedValue(new Error());
      await expect(categoryService.addPlayers('', {} as any)).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('removePlayers', () => {
    it('Should return Category', async () => {
      const id = '3672ihr23t6723y26';
      const removePlayers: RemovePlayerDto = {
        removePlayers: ['idPlayerWhere'],
      };
      const category = createCategory();

      jest
        .spyOn(categoryRepository, 'removePlayers')
        .mockReturnValue(category as any);

      const result = await categoryService.removePlayers(id, removePlayers);

      expect(categoryRepository.removePlayers).toHaveBeenCalledWith(
        id,
        removePlayers,
      );
      expect(result).toEqual(category);
    });

    it('Should return the error "Category not found"', async () => {
      jest.spyOn(categoryRepository, 'removePlayers').mockResolvedValue(null);
      await expect(
        categoryService.removePlayers('idTeste123', {} as any),
      ).rejects.toThrow('Category not found');
    });

    it('Should return the error "Type of id invalid"', async () => {
      const errorImplementKey = new Error();
      errorImplementKey['path'] = '_id';

      jest
        .spyOn(categoryRepository, 'removePlayers')
        .mockImplementationOnce(() => {
          throw errorImplementKey;
        });
      await expect(
        categoryService.removePlayers('', {} as any),
      ).rejects.toThrow('Type of id invalid');
    });

    it('Should return the error "RpcException"', async () => {
      jest
        .spyOn(categoryRepository, 'removePlayers')
        .mockRejectedValue(new Error());
      await expect(
        categoryService.removePlayers('', {} as any),
      ).rejects.toThrow(RpcException);
    });
  });

  describe('findCategoryContainPlayerId', () => {
    it('Should return one category', async () => {
      const id = 'uhdcsush324';
      const category = createCategory();

      jest
        .spyOn(categoryRepository, 'findCategoryContainPlayerId')
        .mockResolvedValue(category as any);

      const result = await categoryService.findCategoryContainPlayerId(id);

      expect(
        categoryRepository.findCategoryContainPlayerId,
      ).toHaveBeenCalledWith(id);
      expect(result).toEqual(category);
    });

    it('Should return the error "category not found"', async () => {
      jest
        .spyOn(categoryRepository, 'findCategoryContainPlayerId')
        .mockResolvedValue(null);
      await expect(
        categoryService.findCategoryContainPlayerId('1a2b3c'),
      ).rejects.toThrow(RpcException);
    });

    it('Should return the error "Type of id invalid"', async () => {
      const errorImplementKey = new Error();
      errorImplementKey['path'] = '_id';

      jest
        .spyOn(categoryRepository, 'findCategoryContainPlayerId')
        .mockImplementationOnce(() => {
          throw errorImplementKey;
        });
      await expect(
        categoryService.findCategoryContainPlayerId('1a2b3c'),
      ).rejects.toThrow('Type of id invalid');
    });

    it('Should return the error "RpcException"', async () => {
      jest
        .spyOn(categoryRepository, 'findCategoryContainPlayerId')
        .mockRejectedValue(new Error());
      await expect(
        categoryService.findCategoryContainPlayerId('1a2b3c'),
      ).rejects.toThrow(RpcException);
    });
  });
});
