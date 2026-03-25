import { Module } from '@nestjs/common';
import { ChallengeController } from './challenge.controller';
import { ClientProxyRmqModule } from 'src/client-proxy-rmq/client-proxy-rmq.module';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [ClientProxyRmqModule, SupabaseModule],
  providers: [ClientProxyRmqModule],
  controllers: [ChallengeController],
})
export class ChallengeModule {}
