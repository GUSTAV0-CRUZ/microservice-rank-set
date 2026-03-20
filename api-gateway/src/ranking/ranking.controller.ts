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
import { ClientProxy } from '@nestjs/microservices';
import { ClientproxyRmqService } from 'src/client-proxy-rmq/client-proxy-rmq.service';
import { CreateRankingDto } from './dtos/create-ranking.dto';
import { UpdateRankingDto } from './dtos/update-ranking.dto';
import { ModifyPerMatchDto } from './dtos/modify-per-match.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientMicroRanking.send('findOneById-ranking', id);
  }

  @HttpCode(202)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRankingDto: UpdateRankingDto) {
    return this.clientMicroRanking.emit('update-ranking', {
      id,
      updateRankingDto,
    });
  }

  @HttpCode(202)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.clientMicroRanking.emit('delete-ranking', id);
  }

  @HttpCode(202)
  @Post('Modify-per-match')
  modifyPerMatch(@Body() modifyPerMatchDto: ModifyPerMatchDto) {
    return this.clientMicroRanking.emit(
      'modifyPerMatch-ranking',
      modifyPerMatchDto,
    );
  }
}
