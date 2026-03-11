import {
  Body,
  Controller,
  HttpCode,
  // Delete,
  Get,
  // Param,
  // Patch,
  Post,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
// import { UpdatePlayerDto } from './dtos/update-player.dto';
import { ClientProxy } from '@nestjs/microservices';
import { ClientproxyRmqService } from 'src/client-proxy-rmq/client-proxy-rmq.service';

@Controller('api/v1/player')
export class PlayerController {
  private clientAdminBackend: ClientProxy;

  constructor(clienteProxyRmqModule: ClientproxyRmqService) {
    this.clientAdminBackend =
      clienteProxyRmqModule.getClientProxyRmqAdminBackend();
  }

  @Get()
  findAll() {
    return this.clientAdminBackend.send('findAll-player', {});
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.clientAdminBackend.(id);
  // }

  @HttpCode(202)
  @Post()
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.clientAdminBackend.emit('create-player', createPlayerDto);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
  //   return this.clientAdminBackend.(id, updatePlayerDto);
  // }

  // @Delete(':id')
  // delete(@Param('id') id: string) {
  //   return this.clientAdminBackend.(id);
  // }
}
