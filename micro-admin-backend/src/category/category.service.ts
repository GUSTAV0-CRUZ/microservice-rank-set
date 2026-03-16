/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './repository/category.repository';
import { RpcException } from '@nestjs/microservices';
import { Category } from './entities/category.entity';
import { AddPlayerDto } from './dto/add-player.dto';
import { PlayerService } from 'src/player/player.service';
import { RemovePlayerDto } from './dto/remove-player.dto';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly playerService: PlayerService,
  ) {}

  private logError(error: any, methodName: string) {
    return this.logger.error({
      methodName,
      message: [error.message],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      stack: error.stack,
    });
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<void> {
    // this.logger.log('CREATECATEGORYDTO:  ', createCategoryDto);
    try {
      await this.categoryRepository.create(createCategoryDto);

      return;
    } catch (error) {
      this.logError(error, this.create.name);
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
      this.logError(error, this.findOne.name);
      if (error.path === '_id') throw new RpcException('Type of id invalid');

      if (error.status === 404) throw new RpcException('Category not found');

      throw new RpcException(error.message);
    }
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      const updatedCategory = await this.categoryRepository.update(
        id,
        updateCategoryDto,
      );

      if (!updatedCategory) throw new RpcException('Category not found');

      return updatedCategory;
    } catch (error) {
      this.logError(error, this.update.name);

      if (error.path === '_id') throw new RpcException('Type of id invalid');

      throw new RpcException(error.message);
    }
  }

  async delete(id: string) {
    try {
      const deletedCategory = await this.categoryRepository.delete(id);
      if (!deletedCategory) throw new RpcException('Category not found');
      return deletedCategory;
    } catch (error) {
      this.logError(error, this.delete.name);

      if (error.path === '_id') throw new RpcException('Type of id invalid');

      throw new RpcException(error.message);
    }
  }

  async addPlayers(id: string, addPlayerDto: AddPlayerDto): Promise<Category> {
    try {
      for (const player of addPlayerDto.addPlayers) {
        await this.playerService.findOne(player);
      }

      const updatedCategory = await this.categoryRepository.addPlayers(
        id,
        addPlayerDto,
      );

      if (!updatedCategory) throw new RpcException('Category not found');

      return updatedCategory;
    } catch (error) {
      this.logError(error, this.addPlayers.name);
      if (error.path === '_id') throw new RpcException('Type of id invalid');

      throw new RpcException(error.message);
    }
  }

  async removePlayers(
    id: string,
    removePlayerDto: RemovePlayerDto,
  ): Promise<Category> {
    try {
      const updatedCategory = await this.categoryRepository.removePlayers(
        id,
        removePlayerDto,
      );

      if (!updatedCategory) throw new RpcException('Category not found');

      return updatedCategory;
    } catch (error) {
      this.logError(error, this.removePlayers.name);
      if (error.path === '_id') throw new RpcException('Type of id invalid');

      throw new RpcException(error.message);
    }
  }

  async findCategoryContainPlayerId(id: string) {
    try {
      const category =
        await this.categoryRepository.findCategoryContainPlayerId(id);

      if (!category) throw new RpcException('Category not found');

      return category;
    } catch (error) {
      if (error.path === '_id') throw new RpcException('Type of id invalid');

      throw new RpcException(error.message);
    }
  }
}
