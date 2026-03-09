import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Main');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@localhost:5672/rank-set'],
        queue: 'admin-backend',
        noAck: false,
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  logger.log('Microservice is listening');
  await app.listen();
}
bootstrap();
