import { Injectable, Logger } from '@nestjs/common';
import { MatchRepository } from './repository/match.repository';
import { CreateMatchDto } from './dto/create-match.dto';
import { Match } from './entities/match.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class MatchService {
  private readonly logger = new Logger(MatchService.name);
  constructor(private readonly matchRepository: MatchRepository) {}

  private logError(error: any, methodName: string) {
    return this.logger.error({
      methodName,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      message: [error.message],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      stack: error.stack,
    });
  }

  async create(createMatchDto: CreateMatchDto): Promise<Match> {
    // this.logger.log(createMatchDto);
    try {
      const match = await this.matchRepository.create(createMatchDto);
      return match;
    } catch (error) {
      this.logError(error, this.create.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
      throw new RpcException(error.message);
    }
  }

  async findAll(): Promise<Match[]> {
    try {
      return await this.matchRepository.findAll();
    } catch (error) {
      this.logError(error, this.findAll.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }

  async findOne(id: string): Promise<Match> {
    try {
      const match = await this.matchRepository.findOneId(id);

      if (!match) throw new RpcException('Match not found');

      return match;
    } catch (error) {
      this.logError(error, this.findOne.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.path === '_id') throw new RpcException('Type of id invalid');

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
      throw new RpcException(error.message);
    }
  }

  // async update(id: string, updateMatchDto: UpdateMatchDto): Promise<Match> {
  //   try {
  //     const match = await this.matchRepository.update(id, updateMatchDto);

  //     if (!match) throw new NotFoundException();

  //     return match;
  //   } catch (error) {
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     if (error.path === '_id')
  //       throw new BadRequestException('Type of id invalid');

  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     if (error.status === 404) throw new NotFoundException('Match not found');

  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // async delete(id: string): Promise<Match> {
  //   try {
  //     const match = await this.matchRepository.delete(id);

  //     if (!match) throw new NotFoundException();

  //     return match;
  //   } catch (error) {
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     if (error.path === '_id')
  //       throw new BadRequestException('Type of id invalid');

  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     if (error.status === 404) throw new NotFoundException('Match not found');

  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //     throw new BadRequestException(error.message);
  //   }
  // }
}
