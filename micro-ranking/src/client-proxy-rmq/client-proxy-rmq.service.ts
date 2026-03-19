import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export class ClientproxyRmqService {
  getClientProxyRmqAdminBackend() {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [String(process.env.RABBITMQ_URL)],
        queue: 'admin-backend',
        queueOptions: { durable: true },
      },
    });
  }

  getClientProxyRmqMicroMatch() {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [String(process.env.RABBITMQ_URL)],
        queue: 'micro-match',
        queueOptions: { durable: true },
      },
    });
  }
}
