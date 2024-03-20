import { Controller, Post, Body, ConflictException, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/user.entity';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  // Login
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response
  ): Promise<{ user: object | null; message: string; success: boolean }> {
    const user = await this.authService.findOne(email);

    let entity: User | null = null;

    if (user) {
      entity = user;
    }

    if (user) {
      const isPasswordValid = await this.authService.validateUserPassword(user, password);

      if (!isPasswordValid) {
        return { user: null, message: 'Incorrect email or password!', success: false };
      } else {
      }
    } else {
      return { user: null,  message: 'User not found!', success: false };
    }

    return {
      user: entity instanceof User ? { id: entity.id, nom: entity.nom, email: entity.email } : null,
      success: true,
      message: 'User logged in successfully!',
    };
  }
}
