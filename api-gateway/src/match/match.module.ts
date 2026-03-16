import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';

@Module({
  imports: [],
  controllers: [MatchController],
})
export class MatchModule {}
