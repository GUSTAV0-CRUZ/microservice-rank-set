import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        noAck: false,
        urls: [String(process.env.RABBITMQ_URL)],
        queue: 'micro-send-email',
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  app.useGlobalPipes(new ValidationPipe());
  logger.log('Listing the microsevice: micro-send-email');
  await app.listen();
}
bootstrap();
