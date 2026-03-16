import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [String(process.env.RABBITMQ_URL)],
        queue: 'micro-match',
        noAck: false,
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  logger.log('listing the microservice: micro-match');
  await app.listen();
}
bootstrap();
