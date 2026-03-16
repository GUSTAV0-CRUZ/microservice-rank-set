import { Controller } from '@nestjs/common';
import { MatchService } from './match.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { CreateMatchDto } from './dto/create-match.dto';
import { Channel, Message } from 'amqplib';

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

  // @Get()
  // findAll(@Query() paginationDto: PaginationDto) {
  //   return this.matchService.findAll(paginationDto);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.matchService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto) {
  //   return this.matchService.update(id, updateMatchDto);
  // }

  // @Delete(':id')
  // delete(@Param('id') id: string) {
  //   return this.matchService.delete(id);
  // }
}
