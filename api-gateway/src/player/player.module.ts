import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { ClientProxyRmqModule } from 'src/client-proxy-rmq/client-proxy-rmq.module';
import { ClientproxyRmqService } from 'src/client-proxy-rmq/client-proxy-rmq.service';

@Module({
  imports: [ClientProxyRmqModule],
  controllers: [PlayerController],
  providers: [ClientproxyRmqService],
})
export class PlayerModule {}
