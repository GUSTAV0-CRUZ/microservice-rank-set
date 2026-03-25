import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/SignUp.dto';
import { SignInDto } from './dtos/signIn.dto';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('api/v2/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('signUp')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('signIn')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Get('confirmed-email')
  confirmedEmail(@Res() res: Response) {
    const emailRedirectUrl =
      this.configService.get<string>('EMAIL_REDIRECT_URL');

    if (emailRedirectUrl) return res.redirect(emailRedirectUrl);

    return res.send(`
      <div style="text-align:center;font-family:Arial;margin-top:50px">
        <h1 style="color:#22c55e">✔ Email confirmado!</h1>
        <p style="color:#555">Sua conta foi ativada com sucesso.</p>
      </div>
    `);
  }
}
