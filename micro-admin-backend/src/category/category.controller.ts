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
import type { UpdateCategoryInterface } from './interfaces/update-category.interface';
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
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (error?.message.includes('SSL routines'))
        return channel.nack(originalMsg, false, true);
      channel.ack(originalMsg);
    }
  }

  @MessagePattern('findAll-category')
  async findAll(@Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;
    try {
      return await this.categoryService.findAll();
    } finally {
      channel.ack(originalMsg);
    }
  }

  @MessagePattern('findOneById-category')
  async findOne(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      const category = await this.categoryService.findOne(id);
      channel.ack(originalMsg);
      return category;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (error?.message.includes('SSL routines'))
        return channel.nack(originalMsg, false, true);
      channel.ack(originalMsg);
      throw error;
    }
  }

  @MessagePattern('update-category')
  async update(
    @Payload() data: UpdateCategoryInterface,
    @Ctx() ctx: RmqContext,
  ) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    const { id, updateCategoryDto } = data;

    try {
      const categoryUpdated = await this.categoryService.update(
        id,
        updateCategoryDto,
      );

      channel.ack(originalMsg);
      return categoryUpdated;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (error?.message.includes('SSL routines'))
        return channel.nack(originalMsg, false, true);
      channel.ack(originalMsg);
    }
  }

  @EventPattern('delete-category')
  async remove(@Payload() id: string, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      await this.categoryService.delete(id);
      channel.ack(originalMsg);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (error?.message.includes('SSL routines'))
        return channel.nack(originalMsg, false, true);
      channel.ack(originalMsg);
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
