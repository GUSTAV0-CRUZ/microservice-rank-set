import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot(String(process.env.CONECTION_MONGODB))],
})
export class AppModule {}
