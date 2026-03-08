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
        urls: ['amqp://guest:guest@localhost:5672/rank-set'],
        queue: 'admin-backend',
        queueOptions: { durable: true },
      },
    });
  }
}
