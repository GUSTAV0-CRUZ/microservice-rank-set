import { BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseProvider } from './providers/supabase.provider';
import { SignUpDto } from './dtos/SignUp.dto';
import { SignInDto } from './dtos/signIn.dto';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseProvider: SupabaseProvider) {}

  async signUp(signUpDto: SignUpDto) {
    try {
      return this.supabaseProvider.signUp(signUpDto);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(error.message);
    }
  }

  signIn(signInDto: SignInDto) {
    try {
      return this.supabaseProvider.signInWithPassword(signInDto);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(error.message);
    }
  }
}
