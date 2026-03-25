import { Module } from '@nestjs/common';
import { RankingController } from './ranking.controller';
import { ClientProxyRmqModule } from 'src/client-proxy-rmq/client-proxy-rmq.module';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [ClientProxyRmqModule, SupabaseModule],
  controllers: [RankingController],
})
export class RankingModule {}
