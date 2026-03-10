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
import { UpdateCategoryDto } from './dto/update-category.dto';
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
  findOne(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      return this.categoryService.findOne(id);
    } finally {
      channel.ack(originalMsg);
    }
  }

  @MessagePattern('update-category')
  async update(@Payload() data: any, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { id, updateCategoryDto } = data;

    try {
      await this.categoryService.update(
        id as string,
        updateCategoryDto as UpdateCategoryDto,
      );
    } finally {
      channel.ack(originalMsg);
    }
  }

  @EventPattern('delete-category')
  remove(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const orininalMsg = ctx.getMessage() as Message;

    try {
      return this.categoryService.delete(id);
    } finally {
      channel.ack(orininalMsg);
    }
  }

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
}
