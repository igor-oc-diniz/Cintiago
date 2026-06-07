import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserWithClient } from './types/user-with-client.type';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtUser } from './types/jwt-payload.type';
import * as express from 'express';

interface RequestWithGoogleUser extends express.Request {
  user: UserWithClient;
}

interface RequestWithJwtUser extends express.Request {
  user: JwtUser;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Get('dev-token')
  devToken() {
    const token = this.authService.generateDevToken();
    return { token };
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() req: RequestWithGoogleUser,
    @Res() res: express.Response,
  ) {
    const user = req.user;
    const tokens = this.authService.generateTokens(user);
    await this.authService.saveRefreshToken(user.id, tokens.refreshToken);

    const hasAddress = user.client !== null;
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5174';
    const baseUrl = hasAddress ? frontendUrl : `${frontendUrl}/onboarding`;

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.redirect(baseUrl); // sem query params
  }

  @Post('refresh')
  async refresh(@Req() req: express.Request, @Res() res: express.Response) {
    const refreshToken: string = req.cookies['refreshToken'];
    const tokens = await this.authService.refreshAccessToken(refreshToken);
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.json({ message: 'Token renovado com sucesso' });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: RequestWithJwtUser) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.authService.getMe(req.user.userId);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: RequestWithJwtUser, @Res() res: express.Response) {
    await this.authService.logout(req.user.userId);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ message: 'Logout realizado com sucesso' });
  }
}
