import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  // Logger,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { ClientproxyRmqService } from 'src/client-proxy-rmq/client-proxy-rmq.service';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { AddPlayerDto } from './dtos/add-player.dto';
import { RemovePlayerDto } from './dtos/remove-player.dto';
import { SupabaseGuard } from 'src/common/guards/supabase.guard';

@Controller('api/v2/category')
export class CategoryController {
  private clientAdminBackend: ClientProxy;
  // private readonly logger = new Logger(CategoryController.name);

  constructor(clientProxyRmqService: ClientproxyRmqService) {
    this.clientAdminBackend =
      clientProxyRmqService.getClientProxyRmqAdminBackend();
  }

  @UseGuards(SupabaseGuard)
  @HttpCode(202)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.clientAdminBackend.emit('create-category', createCategoryDto);
  }

  @Get()
  findAll() {
    return this.clientAdminBackend.send('findAll-category', {});
  }

  @Get(':id')
  fndOne(@Param('id') id: string) {
    return this.clientAdminBackend.send('findOneById-category', id);
  }

  @UseGuards(SupabaseGuard)
  @HttpCode(201)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.clientAdminBackend.send('update-category', {
      id,
      updateCategoryDto,
    });
  }

  @UseGuards(SupabaseGuard)
  @HttpCode(202)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.clientAdminBackend.emit('delete-category', id);
  }

  @UseGuards(SupabaseGuard)
  @HttpCode(202)
  @Patch(':id/addPlayer')
  addPlayer(@Param('id') id: string, @Body() addPlayerDto: AddPlayerDto) {
    return this.clientAdminBackend.emit('addPlayer-inCategory', {
      id,
      addPlayerDto,
    });
  }

  @UseGuards(SupabaseGuard)
  @HttpCode(202)
  @Patch(':id/removePlayer')
  removePlayer(
    @Param('id') id: string,
    @Body() removePlayerDto: RemovePlayerDto,
  ) {
    return this.clientAdminBackend.emit('removePlayer-inCategory', {
      id,
      removePlayerDto,
    });
  }
}
