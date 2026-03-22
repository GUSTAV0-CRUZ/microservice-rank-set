import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { logError } from 'src/common/logError';
import { SendMessageDto } from 'src/dtos/send-message.dto';
import { MailgunService } from 'src/mailgun/mailgun.service';

@Injectable()
export class SendEmailService {
  private readonly logger = new Logger(SendEmailService.name);
  constructor(private readonly mailgunService: MailgunService) {}

  async sendMessage(sendMessageDto: SendMessageDto) {
    try {
      // this.logger.log(sendMessageDto);
      const { to, from } = sendMessageDto;
      const subject = 'any subject';
      const text = 'any text';
      const html = 'any html';

      return await this.mailgunService.sendSimpleMessage(
        to,
        from,
        subject,
        text,
        html,
      );
    } catch (error) {
      logError(this.logger, error, this.sendMessage.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }
}
