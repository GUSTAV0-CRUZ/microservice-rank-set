import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailgunModule } from './mailgun/mailgun.module';
import { SendEmailModule } from './send-email/send-email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailgunModule,
    SendEmailModule,
  ],
})
export class AppModule {}
