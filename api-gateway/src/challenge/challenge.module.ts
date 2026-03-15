import { Module } from '@nestjs/common';
import { ChallengeController } from './challenge.controller';
import { ClientProxyRmqModule } from 'src/client-proxy-rmq/client-proxy-rmq.module';

@Module({
  imports: [ClientProxyRmqModule],
  providers: [ClientProxyRmqModule],
  controllers: [ChallengeController],
})
export class ChallengeModule {}
