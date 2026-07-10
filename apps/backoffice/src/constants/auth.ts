// Sentinel value for "authenticated via httpOnly cookie, no Bearer header".
// The interceptor in api/client.ts ignores this value when building the Authorization header.
export const COOKIE_TOKEN = "cookie";
