import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { SendMessageDto } from 'src/dtos/send-message.dto';
import { Channel, Message } from 'amqplib';
import { SendEmailService } from './send-email.service';

@Controller('send-email')
export class SendEmailController {
  constructor(private readonly sendEmailService: SendEmailService) {}

  @EventPattern('send-message')
  async sendMessage(
    @Payload() sendMessageDto: SendMessageDto,
    @Ctx() ctx: RmqContext,
  ) {
    const channel = ctx.getChannelRef() as Channel;
    const originalMsg = ctx.getMessage() as Message;

    try {
      await this.sendEmailService.sendMessage(sendMessageDto);
      channel.ack(originalMsg);
    } catch (error) {
      channel.ack(originalMsg);
      throw error;
    }
  }
}
