import { Module } from '@nestjs/common';
import { SendEmailService } from './send-email.service';
import { SendEmailController } from './send-email.controller';
import { MailgunModule } from 'src/mailgun/mailgun.module';

@Module({
  imports: [MailgunModule],
  providers: [SendEmailService],
  controllers: [SendEmailController],
})
export class SendEmailModule {}
