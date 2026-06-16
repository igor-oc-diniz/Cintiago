// Valor sentinela para "autenticado via cookie httpOnly, sem header Bearer".
// O interceptor em api/client.ts ignora este valor ao montar o Authorization.
export const COOKIE_TOKEN = "cookie";
