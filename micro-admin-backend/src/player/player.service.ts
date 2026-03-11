/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { PlayerRepository } from './repository/player.repository';
import { CreatePlayerDto } from './dtos/create-player.dto';
// import { UpdatePlayerDto } from './dtos/update-player.dto';
import { Player } from './entities/Player.entitie';
import { RpcException } from '@nestjs/microservices';
// import { PaginationDto } from 'src/utils/pagination.dto';

@Injectable()
export class PlayerService {
  private readonly logger = new Logger(PlayerService.name);
  constructor(private readonly playerRepository: PlayerRepository) {}

  private logError(error: any, methodName: string) {
    return this.logger.error({
      methodName,
      message: [error.message],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      stack: error.stack,
    });
  }

  // async findAll(paginationDto: PaginationDto): Promise<Player[]> {
  //   return await this.playerRepository.findAll(paginationDto);
  // }

  // async findOne(id: string): Promise<Player> {
  //   try {
  //     const player = await this.playerRepository.findOneId(id);

  //     if (!player) throw new NotFoundException();

  //     return player;
  //   } catch (error) {
  //     if (error.path === '_id')
  //       throw new BadRequestException('Type of id invalid');

  //     if (error.status === 404)
  //       throw new NotFoundException(`Player with id: ${id} not found`);

  //     throw new BadRequestException(error.message);
  //   }
  // }

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

  // async update(id: string, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
  //   try {
  //     const updatedPlayer = await this.playerRepository.update(
  //       id,
  //       updatePlayerDto,
  //     );

  //     if (!updatedPlayer) throw new NotFoundException();

  //     return updatedPlayer;
  //   } catch (error) {
  //     if (error.path === '_id')
  //       throw new BadRequestException('Type of id invalid');

  //     if (error.status === 404) throw new NotFoundException('Player not found');

  //     throw new BadRequestException(error.message);
  //   }
  // }

  // async delete(id: string): Promise<Player> {
  //   try {
  //     const deletedPlayer = await this.playerRepository.delete(id);
  //     if (!deletedPlayer) throw new NotFoundException();
  //     return deletedPlayer;
  //   } catch (error) {
  //     if (error.path === '_id')
  //       throw new BadRequestException('Type of id invalid');

  //     if (error.status === 404) throw new NotFoundException('Player not found');

  //     throw new BadRequestException(error.message);
  //   }
  // }
}
