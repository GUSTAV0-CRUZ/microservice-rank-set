import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ClientproxyRmqService } from 'src/client-proxy-rmq/client-proxy-rmq.service';
import { ClientProxy } from '@nestjs/microservices';
import { CreateChallengeDto } from './dto/create-challenge.dto';

@Controller('api/v1/challenge')
export class ChallengeController {
  private microChallengeClientProxy: ClientProxy;

  constructor(clienteProxyRmq: ClientproxyRmqService) {
    this.microChallengeClientProxy =
      clienteProxyRmq.getClientProxyRmqMicroChallenge();
  }

  @HttpCode(202)
  @Post()
  create(@Body() createChallengeDto: CreateChallengeDto) {
    return this.microChallengeClientProxy.emit(
      'create-challenge',
      createChallengeDto,
    );
  }

  // @Get()
  // findAll() {
  //   return this.challengeService.findAll();
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
