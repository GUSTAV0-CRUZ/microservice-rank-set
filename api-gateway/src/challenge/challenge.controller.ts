import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientproxyRmqService } from 'src/client-proxy-rmq/client-proxy-rmq.service';
import { ClientProxy } from '@nestjs/microservices';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

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

  @Get()
  findAll() {
    return this.microChallengeClientProxy.send('findAll-challenge', '');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.microChallengeClientProxy.send('findOneById-challenge', id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChallengeDto: UpdateChallengeDto,
  ) {
    return this.microChallengeClientProxy.send('update-challenge', {
      id,
      updateChallengeDto,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.microChallengeClientProxy.emit('delete-challenge', id);
  }

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
