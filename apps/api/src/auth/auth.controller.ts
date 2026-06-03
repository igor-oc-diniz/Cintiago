import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserWithClient } from './types/user-with-client.type';
import * as express from 'express';

interface RequestWithUser extends express.Request {
  user: UserWithClient;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // O Passport redireciona pro Google automaticamente
  }

  @Get('dev-token')
  devToken() {
    const token = this.authService.generateDevToken();
    return { token };
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleCallback(@Req() req: RequestWithUser, @Res() res: express.Response) {
    const user = req.user;
    const token = this.authService.generateToken(user);

    const hasAddress = user.client !== null;
    const frontendUrl = hasAddress
      ? `http://localhost:4200?token=${token}`
      : `http://localhost:4200/cadastro?token=${token}`;

    res.redirect(frontendUrl);
  }
}
