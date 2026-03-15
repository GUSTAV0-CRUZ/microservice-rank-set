import { Module } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { ChallengeController } from './challenge.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengeSchema } from './schema/challenge.schema';
import { ChallengeRepository } from './repository/challenge.repository';
import { ClienteProxyRmqModule } from 'src/cliente-proxy-rmq/cliente-proxy-rmq.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Challenge', schema: ChallengeSchema }]),
    ClienteProxyRmqModule,
  ],
  controllers: [ChallengeController],
  providers: [ChallengeService, ChallengeRepository],
})
export class ChallengeModule {}
