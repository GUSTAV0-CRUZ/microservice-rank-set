import { Module } from '@nestjs/common';
import { ClientproxyRmqService } from './client-proxy-rmq.service';

@Module({
  providers: [ClientproxyRmqService],
  exports: [ClientproxyRmqService],
})
export class ClientProxyRmqModule {}
