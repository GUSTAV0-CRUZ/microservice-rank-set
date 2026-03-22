import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { logError } from 'src/common/logError';
import { CustomeseEmail } from 'src/configs/customise-email';
import { SendMessageDto } from 'src/dtos/send-message.dto';
import { MailgunService } from 'src/mailgun/mailgun.service';

@Injectable()
export class SendEmailService {
  private readonly logger = new Logger(SendEmailService.name);
  constructor(private readonly mailgunService: MailgunService) {}

  async sendMessage(sendMessageDto: SendMessageDto) {
    // this.logger.log(sendMessageDto);
    const { to, applicantName, challengedName } = sendMessageDto;
    const customeseEmail = new CustomeseEmail(applicantName, challengedName);
    const subject = customeseEmail.getSubjectCustomese();
    const text = customeseEmail.getTextCustomese();
    const html = customeseEmail.getHtmlCustomese();

    const from =
      'Mailgun Sandbox <postmaster@sandboxa0df7f3b4dd1445a8ffef012b16a57c9.mailgun.org>';
    try {
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
