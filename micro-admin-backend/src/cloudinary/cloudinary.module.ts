import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { cloudinaryConfigs } from './cloudinary.configs';

@Module({
  providers: [CloudinaryService, cloudinaryConfigs],
  exports: [CloudinaryService, cloudinaryConfigs],
})
export class CloudinaryModule {}
