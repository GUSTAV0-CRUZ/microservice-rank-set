import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ChallengeService } from './challenge.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { Channel, Message } from 'amqplib';
import type { UpdateChallengeInterface } from './interfaces/update-challenge.interface';

@Controller('api/v1/challenge')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @EventPattern('create-challenge')
  async create(
    @Payload() createChallengeDto: CreateChallengeDto,
    @Ctx() ctx: RmqContext,
  ) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      await this.challengeService.create(createChallengeDto);
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

  @MessagePattern('findAll-challenge')
  async findAll(@Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      const challenges = await this.challengeService.findAll();
      channel.ack(originalMsg);
      return challenges;
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

  @MessagePattern('findOneById-challenge')
  async findOne(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      const challenge = await this.challengeService.findOne(id);
      channel.ack(originalMsg);
      return challenge;
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

  @MessagePattern('update-challenge')
  async update(
    @Payload() updateChallengeInterface: UpdateChallengeInterface,
    @Ctx() ctx: RmqContext,
  ) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;
    const { id, updateChallengeDto } = updateChallengeInterface;

    try {
      const challenge = await this.challengeService.update(
        id,
        updateChallengeDto,
      );
      channel.ack(originalMsg);
      return challenge;
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
  // remove(@Param('id') id: string) {
  //   return this.challengeService.delete(id);
  // }

  // @Get('player/:id')
  // findChallengesByIdPlayer(@Param('id') id: string) {
  //   return this.challengeService.findChallengesByIdPlayer(id);
  // }

  // @Patch(':id/AddMatch')
  // AddMatch(
  //   @Param('id') id: string,
  //   @Body() createAddMatchDto: CreateAddMatchDto,
  // ) {
  //   return this.challengeService.addMatch(id, createAddMatchDto);
  // }
}
