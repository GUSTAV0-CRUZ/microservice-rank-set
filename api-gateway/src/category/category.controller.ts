import { Body, Controller, Post } from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { ClientproxyRmqService } from 'src/client-proxy-rmq/client-proxy-rmq.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller('api/v1/category')
export class CategoryController {
  private clientAdminBackend: ClientProxy;

  constructor(clientProxyRmqModule: ClientproxyRmqService) {
    this.clientAdminBackend =
      clientProxyRmqModule.getClientProxyRmqAdminBackend();
  }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.clientAdminBackend.emit('create', createCategoryDto);
  }
}
