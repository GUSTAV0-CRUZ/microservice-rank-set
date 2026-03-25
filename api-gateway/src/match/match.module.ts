import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { ClientProxyRmqModule } from 'src/client-proxy-rmq/client-proxy-rmq.module';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [ClientProxyRmqModule, SupabaseModule],
  controllers: [MatchController],
})
export class MatchModule {}
