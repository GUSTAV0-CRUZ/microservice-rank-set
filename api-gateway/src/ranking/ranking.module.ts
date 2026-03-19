import { Module } from '@nestjs/common';
import { RankingController } from './ranking.controller';
import { ClientProxyRmqModule } from 'src/client-proxy-rmq/client-proxy-rmq.module';

@Module({
  imports: [ClientProxyRmqModule],
  controllers: [RankingController],
})
export class RankingModule {}
