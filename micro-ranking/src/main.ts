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
        noAck: false,
        queue: 'micro-ranking',
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  logger.log('Initializing microservice micro-ranking...');
  await app.listen();
}
bootstrap();
