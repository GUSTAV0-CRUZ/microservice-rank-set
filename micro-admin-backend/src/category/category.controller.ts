import { Controller } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';
// import { UpdateCategoryDto } from './dto/update-category.dto';
// import { AddPlayerDto } from './dto/add-player.dto';
// import { RemovePlayerDto } from './dto/remove-player.dto';

@Controller('api/v1/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @EventPattern('create-category')
  async create(
    @Payload() createCategoryDto: CreateCategoryDto,
    @Ctx() ctx: RmqContext,
  ) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      await this.categoryService.create(createCategoryDto);
      channel.ack(originalMsg);
    } catch {
      channel.ack(originalMsg);
    }
  }

  @MessagePattern('findAll-category')
  findAll(@Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;
    try {
      return this.categoryService.findAll();
    } finally {
      channel.ack(originalMsg);
    }
  }

  @MessagePattern('findOneById-category')
  findOne(@Payload() id: string) {
    return this.categoryService.findOne(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCategoryDto: UpdateCategoryDto,
  // ) {
  //   return this.categoryService.update(id, updateCategoryDto);
  // }

  // @Patch(':id/addPlayer')
  // addPlayer(@Param('id') id: string, @Body() addPlayerDto: AddPlayerDto) {
  //   return this.categoryService.addPlayers(id, addPlayerDto);
  // }

  // @Patch(':id/removePlayer')
  // removePlayer(
  //   @Param('id') id: string,
  //   @Body() removePlayerDto: RemovePlayerDto,
  // ) {
  //   return this.categoryService.removePlayers(id, removePlayerDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.categoryService.delete(id);
  // }
}
