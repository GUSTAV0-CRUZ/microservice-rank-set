import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ClientproxyRmqService } from 'src/client-proxy-rmq/client-proxy-rmq.service';
import { CreateMatchDto } from './dto/create-match.dto';

@Controller('api/v1/match')
export class MatchController {
  private clientProxymicroMatch: ClientProxy;
  constructor(clientproxyRmqService: ClientproxyRmqService) {
    this.clientProxymicroMatch =
      clientproxyRmqService.getClientProxyMicroMatch();
  }

  @HttpCode(202)
  @Post()
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.clientProxymicroMatch.emit('create-match', createMatchDto);
  }

  @Get()
  findAll() {
    return this.clientProxymicroMatch.send('finAll-match', '');
  }

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
