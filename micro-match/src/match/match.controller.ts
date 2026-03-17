import { Controller } from '@nestjs/common';
import { MatchService } from './match.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateMatchDto } from './dto/create-match.dto';
import { Channel, Message } from 'amqplib';
import type { UpdateMatchInterface } from './interfaces/update-match.interface';

@Controller('api/v1/match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @EventPattern('create-match')
  async create(
    @Payload() createMatchDto: CreateMatchDto,
    @Ctx() ctx: RmqContext,
  ) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      await this.matchService.create(createMatchDto);
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

  @MessagePattern('finAll-match')
  async findAll(@Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      const macthes = await this.matchService.findAll();
      channel.ack(originalMsg);
      return macthes;
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

  @MessagePattern('findOne-match')
  async findOne(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      const macth = await this.matchService.findOne(id);
      channel.ack(originalMsg);
      return macth;
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

  @EventPattern('update-match')
  async update(
    @Payload() updateMatchInterface: UpdateMatchInterface,
    @Ctx() ctx: RmqContext,
  ) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;
    const { id, updateMatchDto } = updateMatchInterface;
    console.log(updateMatchDto);

    try {
      await this.matchService.update(id, updateMatchDto);
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

  // @Delete(':id')
  // delete(@Param('id') id: string) {
  //   return this.matchService.delete(id);
  // }
}
