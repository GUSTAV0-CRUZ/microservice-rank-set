import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ClientproxyRmqService } from 'src/client-proxy-rmq/client-proxy-rmq.service';
import { CreateRankingDto } from './dtos/create-ranking.dto';

@Controller('api/v1/ranking')
export class RankingController {
  private clientMicroRanking: ClientProxy;

  constructor(clienteProxyRmqModule: ClientproxyRmqService) {
    this.clientMicroRanking =
      clienteProxyRmqModule.getClientProxyMicroRanking();
  }
  @HttpCode(202)
  @Post()
  create(@Body() createRankingDto: CreateRankingDto) {
    return this.clientMicroRanking.emit('create-ranking', createRankingDto);
  }

  @Get()
  findAll() {
    return this.clientMicroRanking.send('findAll-ranking', '');
  }
}
