import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseProvider } from './providers/supabase.provider';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let authService: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let supabaseProvider: SupabaseProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        ConfigService,
        {
          provide: SupabaseProvider,
          useValue: {},
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    supabaseProvider = module.get<SupabaseProvider>(SupabaseProvider);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});
