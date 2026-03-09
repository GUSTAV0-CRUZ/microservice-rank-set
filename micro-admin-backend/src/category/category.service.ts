/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  Logger,
  // NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
// import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './repository/category.repository';
import { RpcException } from '@nestjs/microservices';
import { Category } from './entities/category.entity';
// import { Category } from './entities/category.entity';
// import { AddPlayerDto } from './dto/add-player.dto';
// import { RemovePlayerDto } from './dto/remove-player.dto';
// import { PlayerService } from 'src/player/player.service';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    private readonly categoryRepository: CategoryRepository,
    // private readonly playerService: PlayerService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<void> {
    // this.logger.log('CREATECATEGORYDTO:  ', createCategoryDto);
    try {
      await this.categoryRepository.create(createCategoryDto);

      return;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const erroFildRequired: string | undefined = error?.message?.split(
        'Path',
      )[1] as string;
      if (erroFildRequired) throw new RpcException(`Fild:${erroFildRequired}`);
      if (error.code === 11000)
        throw new RpcException('Value of key name is duplicate');

      throw new RpcException(error.message);
    }
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.findAll();
  }

  async findOne(id: string): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOneId(id);

      if (!category) throw new RpcException('Category not found');

      return category;
    } catch (error) {
      if (error.path === '_id') throw new RpcException('Type of id invalid');

      if (error.status === 404) throw new RpcException('Category not found');

      throw new RpcException(error.message);
    }
  }

  // async update(
  //   id: string,
  //   updateCategoryDto: UpdateCategoryDto,
  // ): Promise<Category> {
  //   try {
  //     const updatedCategory = await this.categoryRepository.update(
  //       id,
  //       updateCategoryDto,
  //     );

  //     if (!updatedCategory) throw new NotFoundException();

  //     return updatedCategory;
  //   } catch (error) {
  //     if (error.path === '_id')
  //       throw new BadRequestException('Type of id invalid');

  //     if (error.status === 404)
  //       throw new NotFoundException('Category not found');

  //     throw new BadRequestException(error.message);
  //   }
  // }

  // async delete(id: string): Promise<Category> {
  //   try {
  //     const deletedCategory = await this.categoryRepository.delete(id);
  //     if (!deletedCategory) throw new NotFoundException();
  //     return deletedCategory;
  //   } catch (error) {
  //     if (error.path === '_id')
  //       throw new BadRequestException('Type of id invalid');

  //     if (error.status === 404)
  //       throw new NotFoundException('Category not found');

  //     throw new BadRequestException(error.message);
  //   }
  // }

  // async addPlayers(id: string, addPlayerDto: AddPlayerDto): Promise<Category> {
  //   try {
  //     for (const player of addPlayerDto.addPlayers) {
  //       await this.playerService.findOne(player);
  //     }

  //     const updatedCategory = await this.categoryRepository.addPlayers(
  //       id,
  //       addPlayerDto,
  //     );

  //     if (!updatedCategory) throw new NotFoundException('Category not found');

  //     return updatedCategory;
  //   } catch (error) {
  //     if (error.path === '_id')
  //       throw new BadRequestException('Type of id invalid');

  //     if (error.status === 404) throw new NotFoundException(error.message);

  //     throw new BadRequestException(error.message);
  //   }
  // }

  // async removePlayers(
  //   id: string,
  //   removePlayerDto: RemovePlayerDto,
  // ): Promise<Category> {
  //   try {
  //     const updatedCategory = await this.categoryRepository.removePlayers(
  //       id,
  //       removePlayerDto,
  //     );

  //     if (!updatedCategory) throw new NotFoundException();

  //     return updatedCategory;
  //   } catch (error) {
  //     if (error.path === '_id')
  //       throw new BadRequestException('Type of id invalid');

  //     if (error.status === 404)
  //       throw new NotFoundException('Category not found');

  //     throw new BadRequestException(error.message);
  //   }
  // }

  // async findCategoryContainPlayerId(id: string) {
  //   try {
  //     const category =
  //       await this.categoryRepository.findCategoryContainPlayerId(id);

  //     if (!category) throw new NotFoundException();

  //     return category;
  //   } catch (error) {
  //     if (error.path === '_id')
  //       throw new BadRequestException('Type of id invalid');

  //     if (error.status === 404)
  //       throw new NotFoundException('Category not found');

  //     throw new BadRequestException(error.message);
  //   }
  // }
}
