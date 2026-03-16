import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { PlayerModule } from './player/player.module';
import { ConfigModule } from '@nestjs/config';
import { ChallengeModule } from './challenge/challenge.module';
import { MatchModule } from './match/match.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CategoryModule,
    PlayerModule,
    ChallengeModule,
    MatchModule,
  ],
})
export class AppModule {}
