import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { PlayerRepository } from './repository/player.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerSchema } from './schema/player.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Player', schema: PlayerSchema }]),
    CloudinaryModule,
  ],
  controllers: [PlayerController],
  providers: [PlayerService, PlayerRepository, CloudinaryService],
  exports: [PlayerService, PlayerRepository, CloudinaryService],
})
export class PlayerModule {}
