import { Injectable } from '@nestjs/common';
import {
  SignUpWithPasswordCredentials,
  SupabaseClient,
} from '@supabase/supabase-js';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class SupabaseProvider {
  private suparbase: SupabaseClient;

  constructor(supabaseService: SupabaseService) {
    this.suparbase = supabaseService.getClient();
  }

  signUp(credentials: SignUpWithPasswordCredentials) {
    return this.suparbase.auth.signUp(credentials);
  }

  signInWithPassword(credentials: SignUpWithPasswordCredentials) {
    return this.suparbase.auth.signInWithPassword(credentials);
  }
}
