import { Module } from '@nestjs/common';
import { ClienteProxyRmqService } from './cliente-proxy-rmq.service';

@Module({
  providers: [ClienteProxyRmqService],
  exports: [ClienteProxyRmqService],
})
export class ClienteProxyRmqModule {}
