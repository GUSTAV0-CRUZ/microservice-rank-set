import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { ClientProxyRmqModule } from 'src/client-proxy-rmq/client-proxy-rmq.module';
import { ClientproxyRmqService } from 'src/client-proxy-rmq/client-proxy-rmq.service';
import { AuthModule } from 'src/auth/auth.module';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [ClientProxyRmqModule, AuthModule, SupabaseModule],
  controllers: [PlayerController],
  providers: [ClientproxyRmqService],
})
export class PlayerModule {}
