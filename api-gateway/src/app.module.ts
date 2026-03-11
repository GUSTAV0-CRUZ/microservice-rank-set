import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [CategoryModule, PlayerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
