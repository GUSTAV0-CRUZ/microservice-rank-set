import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class ClientproxyRmqService {
  getClientProxyRmqAdminBackend(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [String(process.env.RABBITMQ_URL)],
        queue: 'admin-backend',
        queueOptions: { durable: true },
      },
    });
  }

  getClientProxyRmqMicroChallenge() {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [String(process.env.RABBITMQ_URL)],
        queue: 'micro-challenge',
        queueOptions: { durable: true },
      },
    });
  }

  getClientProxyMicroMatch() {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [String(process.env.RABBITMQ_URL)],
        queue: 'micro-match',
        queueOptions: {
          durable: true,
        },
      },
    });
  }
}
