import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { ClientProxyRmqModule } from 'src/client-proxy-rmq/client-proxy-rmq.module';
import { ClientproxyRmqService } from 'src/client-proxy-rmq/client-proxy-rmq.service';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [ClientProxyRmqModule, SupabaseModule],
  providers: [ClientproxyRmqService],
  controllers: [CategoryController],
})
export class CategoryModule {}
