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
        noAck: false,
        queue: 'micro-challenge',
        urls: [String(process.env.RABBITMQ_URL)],
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  logger.log('Initializing microservice micro-challenge...');
  await app.listen();
}
bootstrap();
