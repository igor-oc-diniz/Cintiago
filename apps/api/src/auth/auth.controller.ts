import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
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
    const baseUrl = hasAddress
      ? 'http://localhost:4200'
      : 'http://localhost:4200/cadastro';

    const redirectUrl = `${baseUrl}?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`;
    res.redirect(redirectUrl);
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    const tokens = await this.authService.refreshAccessToken(refreshToken);
    return tokens;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: RequestWithJwtUser) {
    await this.authService.logout(req.user.userId);
    return { message: 'Logout realizado com sucesso' };
  }
}
