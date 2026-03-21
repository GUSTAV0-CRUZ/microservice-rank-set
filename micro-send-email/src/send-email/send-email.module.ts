import { Module } from '@nestjs/common';
import { SendEmailService } from './send-email.service';
import { SendEmailController } from './send-email.controller';

@Module({
  providers: [SendEmailService],
  controllers: [SendEmailController],
})
export class SendEmailModule {}
