import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class ClienteProxyRmqService {
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
}
