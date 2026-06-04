import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserWithClient } from './types/user-with-client.type';
import { JwtService } from '@nestjs/jwt';
import { Role } from './enums/role.enum';

interface FindOrCreateUserDto {
  googleId: string;
  email: string;
  name: string;
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

  generateToken(user: UserWithClient) {
    return this.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      hasAddress: user.client !== null,
    });
  }
}
