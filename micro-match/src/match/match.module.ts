import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchSchema } from './schema/match.schema';
import { MatchRepository } from './repository/match.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Match', schema: MatchSchema }]),
  ],
  controllers: [MatchController],
  providers: [MatchService, MatchRepository],
})
export class MatchModule {}
