import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { PlayerModule } from './player/player.module';
import { ConfigModule } from '@nestjs/config';
import { ChallengeModule } from './challenge/challenge.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CategoryModule,
    PlayerModule,
    ChallengeModule,
  ],
})
export class AppModule {}
