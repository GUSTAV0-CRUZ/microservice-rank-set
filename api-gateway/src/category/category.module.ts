import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { ClientProxyRmqModule } from 'src/client-proxy-rmq/client-proxy-rmq.module';
import { ClientproxyRmqService } from 'src/client-proxy-rmq/client-proxy-rmq.service';

@Module({
  imports: [ClientProxyRmqModule],
  providers: [ClientproxyRmqService],
  controllers: [CategoryController],
})
export class CategoryModule {}
