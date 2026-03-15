import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChallengeModule } from './challenge/challenge.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ClienteProxyRmqModule } from './cliente-proxy-rmq/cliente-proxy-rmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(String(process.env.CONECTION_MONGODB)),
    ChallengeModule,
    ClienteProxyRmqModule,
  ],
})
export class AppModule {}
