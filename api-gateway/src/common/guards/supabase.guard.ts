import {
  UnauthorizedException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import type { Request } from 'express';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class SupabaseGuard implements CanActivate {
  private readonly supabase: SupabaseClient;
  constructor(supabaseService: SupabaseService) {
    this.supabase = supabaseService.getClient();
  }

  extractToken(request: Request) {
    const [type, token] = request?.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(req);

    if (!token) throw new UnauthorizedException('Requerid authorization');

    try {
      const data = await this.supabase.auth.getUser(token);
      if (data.error) throw new UnauthorizedException(data.error.message);

      req['user'] = data?.data?.user?.user_metadata;

      return true;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new UnauthorizedException(error.message);
    }
  }
}
