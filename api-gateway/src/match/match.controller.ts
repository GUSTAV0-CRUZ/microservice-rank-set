import {
  Body,
  Controller,
  // Delete,
  Get,
  // HttpCode,
  Param,
  // Patch,
  // Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ClientproxyRmqService } from 'src/client-proxy-rmq/client-proxy-rmq.service';
// import { CreateMatchDto } from './dto/create-match.dto';
// import { UpdateMatchDto } from './dto/update-match.dto';
import { SupabaseGuard } from 'src/common/guards/supabase.guard';

@UseGuards(SupabaseGuard)
@Controller('api/v2/match')
export class MatchController {
  private clientProxymicroMatch: ClientProxy;
  constructor(clientproxyRmqService: ClientproxyRmqService) {
    this.clientProxymicroMatch =
      clientproxyRmqService.getClientProxyMicroMatch();
  }

  // @HttpCode(202)
  // @Post()
  // create(@Body() createMatchDto: CreateMatchDto) {
  //   return this.clientProxymicroMatch.emit('create-match', createMatchDto);
  // }

  @Get()
  findAll() {
    return this.clientProxymicroMatch.send('finAll-match', '');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientProxymicroMatch.send('findOne-match', id);
  }

  // @HttpCode(202)
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto) {
  //   return this.clientProxymicroMatch.emit('update-match', {
  //     id,
  //     updateMatchDto,
  //   });
  // }

  // @Delete(':id')
  // delete(@Param('id') id: string) {
  //   return this.clientProxymicroMatch.emit('delete-match', id);
  // }
}
