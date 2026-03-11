import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { PlayerRepository } from './repository/player.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerSchema } from './schema/player.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Player', schema: PlayerSchema }]),
  ],
  controllers: [PlayerController],
  providers: [PlayerService, PlayerRepository],
  exports: [PlayerService, PlayerRepository],
})
export class PlayerModule {}
