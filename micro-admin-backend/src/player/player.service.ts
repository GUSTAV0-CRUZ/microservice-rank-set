/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { PlayerRepository } from './repository/player.repository';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './entities/Player.entitie';
import { RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/utils/pagination.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class PlayerService {
  private readonly logger = new Logger(PlayerService.name);
  constructor(
    private readonly playerRepository: PlayerRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private logError(error: any, methodName: string) {
    return this.logger.error({
      methodName,
      message: [error.message],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      stack: error.stack,
    });
  }

  async findAll(paginationDto: PaginationDto): Promise<Player[]> {
    const limit = paginationDto?.limit;
    const offset = paginationDto?.offset;
    return await this.playerRepository.findAll({ limit, offset });
  }

  async findOne(id: string): Promise<Player> {
    try {
      const player = await this.playerRepository.findOneId(id);

      if (!player) throw new RpcException(`Player with id: ${id} not found`);

      return player;
    } catch (error) {
      this.logError(error, this.findOne.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (error?.message?.includes('Cast to ObjectId failed for value'))
        throw new RpcException('Type of id invalid');

      throw new RpcException(error.message as string);
    }
  }

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    // this.logger.log({ createPlayerDto });
    try {
      const player = await this.playerRepository.create(createPlayerDto);
      return player;
    } catch (error) {
      this.logError(error, this.create.name);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (error?.message?.includes(`dup key: { tell:`))
        throw new RpcException('Value of key tell is duplicate');

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (error?.message?.includes(`dup key: { email:`))
        throw new RpcException('Value of key email is duplicate');

      throw new RpcException(error.message as string);
    }
  }

  async update(id: string, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    try {
      const updatedPlayer = await this.playerRepository.update(
        id,
        updatePlayerDto,
      );

      if (!updatedPlayer) throw new RpcException('Player not found');

      return updatedPlayer;
    } catch (error) {
      this.logError(error, this.update.name);
      if (error.path === '_id') throw new RpcException('Type of id invalid');

      throw new RpcException(error.message as string);
    }
  }

  async delete(id: string): Promise<Player> {
    try {
      const deletedPlayer = await this.playerRepository.delete(id);
      if (!deletedPlayer) throw new RpcException('Player not found');
      return deletedPlayer;
    } catch (error) {
      this.logError(error, this.delete.name);
      if (error.path === '_id') throw new RpcException('Type of id invalid');

      throw new RpcException(error.message as string);
    }
  }

  async uploadedImage(id: string, file: Express.Multer.File) {
    try {
      const fileName = `${id}-imageProfile`;

      const uploadedFile = await this.cloudinaryService.uploadedFile(
        file,
        fileName,
      );

      return await this.update(id, { pictureUrl: uploadedFile.url });
    } catch (error) {
      this.logError(error, this.uploadedImage.name);
      if (error.path === '_id') throw new RpcException('Type of id invalid');

      throw new RpcException(error.message as string);
    }
  }
}
