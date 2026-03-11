import { Controller, Logger, Query } from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dtos/create-player.dto';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';
import { PaginationDto } from 'src/utils/pagination.dto';
import type { UpdatePlayerInterface } from './interfaces/update-player.interface';
// import { UpdatePlayerDto } from './dtos/update-player.dto';
// import { PaginationDto } from 'src/utils/pagination.dto';

@Controller('api/v1/player')
export class PlayerController {
  private readonly logger = new Logger(PlayerController.name);

  constructor(private readonly playerService: PlayerService) {}

  @MessagePattern('findAll-player')
  async findAll(@Query() paginationDto: PaginationDto, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;
    try {
      return await this.playerService.findAll(paginationDto);
    } finally {
      channel.ack(originalMsg);
    }
  }

  @MessagePattern('findOneById-player')
  async findOne(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      const palyer = await this.playerService.findOne(id);
      channel.ack(originalMsg);
      return palyer;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (error?.message?.includes('SSL routines'))
        return channel.nack(originalMsg, false, true);

      channel.ack(originalMsg);
      throw error;
    }
  }

  @EventPattern('create-player')
  async create(
    @Payload() createPlayerDto: CreatePlayerDto,
    @Ctx() ctx: RmqContext,
  ) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      await this.playerService.create(createPlayerDto);
      channel.ack(originalMsg);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (error?.message?.includes('SSL routines'))
        return channel.nack(originalMsg, false, true);

      channel.ack(originalMsg);
    }
  }

  @EventPattern('update-player')
  async update(
    @Payload() updatePlayerInterface: UpdatePlayerInterface,
    @Ctx() ctx: RmqContext,
  ) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;
    const { id, updatePlayerDto } = updatePlayerInterface;

    try {
      await this.playerService.update(id, updatePlayerDto);
      channel.ack(originalMsg);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (error?.message?.includes('SSL routines'))
        return channel.nack(originalMsg, false, true);

      channel.ack(originalMsg);
    }
  }

  @EventPattern('delete-player')
  async delete(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      await this.playerService.delete(id);
      channel.ack(originalMsg);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (error?.message?.includes('SSL routines'))
        return channel.nack(originalMsg, false, true);

      channel.ack(originalMsg);
    }
  }
}
