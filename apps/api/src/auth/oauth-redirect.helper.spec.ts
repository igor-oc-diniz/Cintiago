import { resolveOAuthRedirect } from './oauth-redirect.helper';

describe('resolveOAuthRedirect', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe('web origin (default)', () => {
    it('redirects to FRONTEND_URL when the user has an address', () => {
      process.env.FRONTEND_URL = 'https://web.example.com';
      expect(resolveOAuthRedirect('web', true)).toBe('https://web.example.com');
    });

    it('appends /onboarding when the user has no address', () => {
      process.env.FRONTEND_URL = 'https://web.example.com';
      expect(resolveOAuthRedirect('web', false)).toBe(
        'https://web.example.com/onboarding',
      );
    });

    it('falls back to web when state is missing', () => {
      process.env.FRONTEND_URL = 'https://web.example.com';
      expect(resolveOAuthRedirect(undefined, true)).toBe(
        'https://web.example.com',
      );
    });

    it('falls back to localhost:5174 without FRONTEND_URL', () => {
      delete process.env.FRONTEND_URL;
      expect(resolveOAuthRedirect(undefined, true)).toBe(
        'http://localhost:5174',
      );
    });
  });

  describe('backoffice origin', () => {
    it('redirects to BACKOFFICE_URL', () => {
      process.env.BACKOFFICE_URL = 'https://backoffice.example.com';
      expect(resolveOAuthRedirect('backoffice', true)).toBe(
        'https://backoffice.example.com',
      );
    });

    it('never appends /onboarding, even without an address', () => {
      process.env.BACKOFFICE_URL = 'https://backoffice.example.com';
      expect(resolveOAuthRedirect('backoffice', false)).toBe(
        'https://backoffice.example.com',
      );
    });

    it('falls back to localhost:5175 without BACKOFFICE_URL', () => {
      delete process.env.BACKOFFICE_URL;
      expect(resolveOAuthRedirect('backoffice', true)).toBe(
        'http://localhost:5175',
      );
    });
  });

  describe('allowlist', () => {
    it('never redirects to a free-form URL carried in state', () => {
      process.env.FRONTEND_URL = 'https://web.example.com';
      expect(resolveOAuthRedirect('https://evil.example.com', true)).toBe(
        'https://web.example.com',
      );
    });
  });
});
