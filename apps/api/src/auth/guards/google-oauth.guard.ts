import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as express from 'express';

// Wraps AuthGuard('google') to carry the login origin through the OAuth
// round-trip: GET /auth/google?from=backoffice becomes the OAuth `state`
// param, which Google echoes back to the callback untouched. The callback
// then resolves the redirect target from an allowlist (never a free URL).
@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<express.Request>();
    const from = request.query.from;
    return typeof from === 'string' ? { state: from } : {};
  }
}
