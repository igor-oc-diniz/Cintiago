import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserWithClient } from './types/user-with-client.type';
import { MeResponse } from './types/jwt-payload.type';
import { JwtService } from '@nestjs/jwt';
import { Role } from './enums/role.enum';
import * as bcrypt from 'bcrypt';

interface FindOrCreateUserDto {
  googleId: string;
  email: string;
  name: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async findOrCreateUser(data: FindOrCreateUserDto): Promise<UserWithClient> {
    const existing = await this.prisma.user.findUnique({
      where: { googleId: data.googleId },
      include: { client: true },
    });

    if (existing) return existing;

    return this.prisma.user.create({
      data: {
        googleId: data.googleId,
        email: data.email,
        name: data.name,
      },
      include: { client: true },
    });
  }

  generateDevToken() {
    return this.jwt.sign({
      sub: 0,
      email: 'dev@dev.com',
      role: Role.OPERATOR,
      hasAddress: true,
    });
  }

  generateTokens(user: UserWithClient): TokenPair {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      hasAddress: user.client !== null,
    };

    const accessToken = this.jwt.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwt.sign({ sub: user.id }, { expiresIn: '30d' });

    return { accessToken, refreshToken };
  }

  async saveRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hash },
    });
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenPair> {
    let userId: number;
    try {
      const payload = this.jwt.verify<{ sub: number }>(refreshToken);
      userId = payload.sub;
    } catch {
      throw new UnauthorizedException('Refresh token inválido');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { client: true },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    const tokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!tokenMatches) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    const tokens = this.generateTokens(user);
    await this.saveRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }

  async getMe(userId: number): Promise<MeResponse | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { client: true },
    });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: null,
      role: user.role,
      clientId: user.client?.id ?? null,
    };
  }

  async logout(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}
