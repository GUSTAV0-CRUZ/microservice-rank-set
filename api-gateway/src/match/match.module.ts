import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { ClientProxyRmqModule } from 'src/client-proxy-rmq/client-proxy-rmq.module';

@Module({
  imports: [ClientProxyRmqModule],
  controllers: [MatchController],
})
export class MatchModule {}
