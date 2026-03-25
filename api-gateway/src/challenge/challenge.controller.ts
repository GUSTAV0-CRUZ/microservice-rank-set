import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientproxyRmqService } from 'src/client-proxy-rmq/client-proxy-rmq.service';
import { ClientProxy } from '@nestjs/microservices';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { CreateAddMatchDto } from './dto/create-addMatch.dto';
import { SupabaseGuard } from 'src/common/guards/supabase.guard';

@Controller('api/v2/challenge')
export class ChallengeController {
  private microChallengeClientProxy: ClientProxy;

  constructor(clienteProxyRmq: ClientproxyRmqService) {
    this.microChallengeClientProxy =
      clienteProxyRmq.getClientProxyRmqMicroChallenge();
  }

  @UseGuards(SupabaseGuard)
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

  @UseGuards(SupabaseGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.microChallengeClientProxy.send('findOneById-challenge', id);
  }

  @UseGuards(SupabaseGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChallengeDto: UpdateChallengeDto,
  ) {
    return this.microChallengeClientProxy.emit('update-challenge', {
      id,
      updateChallengeDto,
    });
  }

  @UseGuards(SupabaseGuard)
  @HttpCode(202)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.microChallengeClientProxy.emit('delete-challenge', id);
  }

  @UseGuards(SupabaseGuard)
  @Get('player/:id')
  findChallengesByIdPlayer(@Param('id') id: string) {
    return this.microChallengeClientProxy.send(
      'findChallengesByIdPlayer-challenge',
      id,
    );
  }

  @UseGuards(SupabaseGuard)
  @HttpCode(202)
  @Patch(':id/AddMatch')
  AddMatch(
    @Param('id') id: string,
    @Body() createAddMatchDto: CreateAddMatchDto,
  ) {
    return this.microChallengeClientProxy.send('addMatch-challenge', {
      id,
      createAddMatchDto,
    });
  }
}
