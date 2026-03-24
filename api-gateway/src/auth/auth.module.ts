import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SupabaseProvider } from './providers/supabase.provider';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  providers: [AuthService, SupabaseProvider],
  controllers: [AuthController],
})
export class AuthModule {}
