import { Controller, Query } from '@nestjs/common';
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
// import { UpdatePlayerDto } from './dtos/update-player.dto';
// import { PaginationDto } from 'src/utils/pagination.dto';

@Controller('api/v1/player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @MessagePattern('findAll-player')
  findAll(@Query() paginationDto: PaginationDto) {
    return this.playerService.findAll(paginationDto);
  }

  @MessagePattern('findOneById-player')
  findOne(@Payload() id: string) {
    return this.playerService.findOne(id);
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

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
  //   return this.playerService.update(id, updatePlayerDto);
  // }

  // @Delete(':id')
  // delete(@Param('id') id: string) {
  //   return this.playerService.delete(id);
  // }
}
