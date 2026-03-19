import { Module } from '@nestjs/common';
import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';
import { ClientProxyRmqModule } from '../client-proxy-rmq/client-proxy-rmq.module';
import { RankingRepository } from './repository/ranking.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { RankingSchema } from './schema/ranking.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Ranking', schema: RankingSchema }]),
    ClientProxyRmqModule,
  ],
  controllers: [RankingController],
  providers: [RankingService, RankingRepository],
})
export class RankingModule {}
