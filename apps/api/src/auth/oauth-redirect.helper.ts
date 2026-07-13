// Allowlisted OAuth redirect targets, keyed by the `state` value sent on
// GET /auth/google (?from=...). The redirect must never come from a free-form
// URL in the request — unknown/missing state falls back to the client app.
const REDIRECT_TARGETS = {
  web: () => process.env.FRONTEND_URL ?? 'http://localhost:5174',
  backoffice: () => process.env.BACKOFFICE_URL ?? 'http://localhost:5175',
} as const;

export function resolveOAuthRedirect(
  state: unknown,
  hasAddress: boolean,
): string {
  const origin = state === 'backoffice' ? 'backoffice' : 'web';
  const baseUrl = REDIRECT_TARGETS[origin]();

  // Onboarding is a client-app concept; non-operators reaching the
  // backoffice are handled by its own role guard, not here.
  if (origin === 'web' && !hasAddress) {
    return `${baseUrl}/onboarding`;
  }

  return baseUrl;
}
