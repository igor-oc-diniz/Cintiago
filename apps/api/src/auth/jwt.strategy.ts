import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayload, JwtUser } from './types/jwt-payload.type';

function extractFromCookieOrBearer(req: Request): string | null {
  const fromBearer = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  if (fromBearer) return fromBearer;
  return (req.cookies?.['accessToken'] as string | undefined) ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: extractFromCookieOrBearer,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? '',
      passReqToCallback: false,
    });
  }

  validate(payload: JwtPayload): JwtUser {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
