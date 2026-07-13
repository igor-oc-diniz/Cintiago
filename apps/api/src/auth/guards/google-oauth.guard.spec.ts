import { ExecutionContext } from '@nestjs/common';
import { GoogleOAuthGuard } from './google-oauth.guard';

describe('GoogleOAuthGuard', () => {
  const guard = new GoogleOAuthGuard();

  const buildContext = (query: Record<string, unknown>): ExecutionContext =>
    ({
      switchToHttp: () => ({ getRequest: () => ({ query }) }),
    }) as never;

  it('forwards ?from= as the OAuth state param', () => {
    expect(
      guard.getAuthenticateOptions(buildContext({ from: 'backoffice' })),
    ).toEqual({ state: 'backoffice' });
  });

  it('sends no state when ?from= is missing', () => {
    expect(guard.getAuthenticateOptions(buildContext({}))).toEqual({});
  });

  it('ignores non-string ?from= values', () => {
    expect(
      guard.getAuthenticateOptions(buildContext({ from: ['a', 'b'] })),
    ).toEqual({});
  });
});
