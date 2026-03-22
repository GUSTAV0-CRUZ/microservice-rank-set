import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { logError } from 'src/common/logError';

@Injectable()
export class MailgunService {
  private logger = new Logger(MailgunService.name);

  async sendSimpleMessage(
    to: string,
    from: string,
    text: string,
    html: string,
  ) {
    this.logger.log(to, from, text, html);
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: String(process.env.MAILGUN_USER_NAME) || 'api',
      key: String(process.env.MAILGUN_API_KEY) || 'API_KEY',
      // When you have an EU-domain, you must specify the endpoint:
      // url: 'https://api.eu.mailgun.net'
    });

    try {
      const domain = String(process.env.MAILGUN_DOMAIN);

      const message = {
        from: '',
        to: [''],
        subject: '',
        text: '',
      };

      const data = await mg.messages.create(domain, message);

      this.logger.log(data);
      return data;
    } catch (error) {
      logError(this.logger, error, this.sendSimpleMessage.name);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new RpcException(error.message);
    }
  }
}
