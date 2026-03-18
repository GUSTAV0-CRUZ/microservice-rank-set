import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RankingModule } from './ranking/ranking.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(String(process.env.CONECTION_MONGODB)),
    RankingModule,
  ],
})
export class AppModule {}
