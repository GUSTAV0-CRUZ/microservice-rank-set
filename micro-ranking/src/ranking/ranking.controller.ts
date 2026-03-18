import { Controller } from '@nestjs/common';
import { RankingService } from './ranking.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateRankingDto } from './dtos/create-ranking.dto';
import { Channel, Message } from 'amqplib';
import { UpdateRankingInterface } from './interfaces/update-ranking.interface';

@Controller()
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @EventPattern('create-ranking')
  async create(
    @Payload() createRankingDto: CreateRankingDto,
    @Ctx() ctx: RmqContext,
  ) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      await this.rankingService.create(createRankingDto);
      channel.ack(originalMsg);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (error?.message?.includes('SSL routines')) {
        channel.nack(originalMsg, false, true);
        throw error;
      }

      channel.ack(originalMsg);
      throw error;
    }
  }

  @MessagePattern('findAll-ranking')
  async findAll(@Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      const rankings = await this.rankingService.findAll();
      channel.ack(originalMsg);
      return rankings;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (error?.message?.includes('SSL routines')) {
        channel.nack(originalMsg, false, true);
        throw error;
      }

      channel.ack(originalMsg);
      throw error;
    }
  }

  @MessagePattern('findOneById-ranking')
  async findOne(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      const rankings = await this.rankingService.findOne(id);
      channel.ack(originalMsg);
      return rankings;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (error?.message?.includes('SSL routines')) {
        channel.nack(originalMsg, false, true);
        throw error;
      }

      channel.ack(originalMsg);
      throw error;
    }
  }

  @EventPattern('update-ranking')
  async update(
    @Payload() updateRankingInterface: UpdateRankingInterface,
    @Ctx() ctx: RmqContext,
  ) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;
    const { id, updateRankingDto } = updateRankingInterface;

    try {
      await this.rankingService.update(id, updateRankingDto);
      channel.ack(originalMsg);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (error?.message?.includes('SSL routines')) {
        channel.nack(originalMsg, false, true);
        throw error;
      }

      channel.ack(originalMsg);
      throw error;
    }
  }

  @EventPattern('delete-ranking')
  async delete(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      await this.rankingService.delete(id);
      channel.ack(originalMsg);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (error?.message?.includes('SSL routines')) {
        channel.nack(originalMsg, false, true);
        throw error;
      }

      channel.ack(originalMsg);
      throw error;
    }
  }
}
