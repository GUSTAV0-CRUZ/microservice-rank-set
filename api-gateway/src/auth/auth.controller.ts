import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/SignUp.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  signUp(@Body() signUpDto: SignUpDto) {
    console.log(signUpDto);
    return this.authService.signUp(signUpDto);
  }

  @Post()
  signIn() {
    return this.authService.signIn();
  }
}
