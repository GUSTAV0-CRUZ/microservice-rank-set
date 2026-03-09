import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { ClientproxyRmqService } from 'src/client-proxy-rmq/client-proxy-rmq.service';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Controller('api/v1/category')
export class CategoryController {
  private clientAdminBackend: ClientProxy;
  private readonly logger = new Logger(CategoryController.name);

  constructor(clientProxyRmqModule: ClientproxyRmqService) {
    this.clientAdminBackend =
      clientProxyRmqModule.getClientProxyRmqAdminBackend();
  }

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
  indOne(@Param('id') id: string) {
    return this.clientAdminBackend.send('findOneById-category', id);
  }

  @HttpCode(202)
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
}
