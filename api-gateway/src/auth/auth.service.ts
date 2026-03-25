import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseProvider } from './providers/supabase.provider';
import { SignUpDto } from './dtos/SignUp.dto';
import { SignInDto } from './dtos/signIn.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private domainApiUrl: string;

  constructor(
    private readonly supabaseProvider: SupabaseProvider,
    configService: ConfigService,
  ) {
    this.domainApiUrl =
      configService.get<string>('DOMAIN_API_URL') ?? 'http://localhost:3000';
  }

  async signUp(signUpDto: SignUpDto) {
    try {
      const { data, error } = await this.supabaseProvider.signUp({
        ...signUpDto,
        options: {
          emailRedirectTo: `${this.domainApiUrl}/api/v2/auth/confirmed-email`,
        },
      });

      if (error) throw new BadRequestException(error.message);

      return data.user;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(error.message);
    }
  }

  async signIn(signInDto: SignInDto) {
    try {
      const { data, error } =
        await this.supabaseProvider.signInWithPassword(signInDto);

      if (error) throw new UnauthorizedException(error.message);

      const { access_token, refresh_token } = data.session;

      return { access_token, refresh_token };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new UnauthorizedException(error.message);
    }
  }
}
