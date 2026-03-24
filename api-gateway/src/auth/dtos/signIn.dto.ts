import { IsEmail, IsString, Matches } from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'password: Min 8 caracter, include uppercase, lowercase, numbers, and special characters',
    },
  )
  password: string;
}
