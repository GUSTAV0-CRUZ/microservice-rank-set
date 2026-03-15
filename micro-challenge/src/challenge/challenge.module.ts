// import { Module } from '@nestjs/common';
// import { ChallengeService } from './challenge.service';
// import { ChallengeController } from './challenge.controller';
// import { MongooseModule } from '@nestjs/mongoose';
// import { ChallengeSchema } from './schema/challenge.schema';
// import { ChallengeRepository } from './repository/challenge.repository';
// import { PlayerService } from 'src/player/player.service';
// import { PlayerModule } from 'src/player/player.module';
// import { CategoryService } from 'src/category/category.service';
// import { CategoryModule } from 'src/category/category.module';
// import { MatchService } from 'src/match/match.service';
// import { MatchModule } from 'src/match/match.module';

// @Module({
//   imports: [
//     MongooseModule.forFeature([{ name: 'Challenge', schema: ChallengeSchema }]),
//     PlayerModule,
//     CategoryModule,
//     MatchModule,
//   ],
//   controllers: [ChallengeController],
//   providers: [
//     ChallengeService,
//     ChallengeRepository,
//     PlayerService,
//     CategoryService,
//     MatchService,
//   ],
//   exports: [
//     ChallengeService,
//     ChallengeRepository,
//     PlayerService,
//     CategoryService,
//   ],
// })
// export class ChallengeModule {}
