import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ChallengeService } from './challenge.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { Channel, Message } from 'amqplib';

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

  // @Get()
  // findAll(@Query() paginationDto: PaginationDto) {
  //   return this.challengeService.findAll(paginationDto);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.challengeService.findOne(id);
  // }

  // @Get('player/:id')
  // findChallengesByIdPlayer(@Param('id') id: string) {
  //   return this.challengeService.findChallengesByIdPlayer(id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateChallengeDto: UpdateChallengeDto,
  // ) {
  //   return this.challengeService.update(id, updateChallengeDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.challengeService.delete(id);
  // }

  // @Patch(':id/AddMatch')
  // AddMatch(
  //   @Param('id') id: string,
  //   @Body() createAddMatchDto: CreateAddMatchDto,
  // ) {
  //   return this.challengeService.addMatch(id, createAddMatchDto);
  // }
}
