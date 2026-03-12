import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './schemas/category.schema';
import { CategoryRepository } from './repository/category.repository';
import { PlayerService } from 'src/player/player.service';
import { PlayerModule } from 'src/player/player.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
    PlayerModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, PlayerService],
  exports: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
