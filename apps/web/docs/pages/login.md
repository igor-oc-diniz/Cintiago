# Login (`/login`)

Porta de autenticação via Google OAuth.

[↩ Voltar ao README](../../README.md) · [Índice de páginas](./README.md)

| Item      | Valor                                                 |
| --------- | ----------------------------------------------------- |
| Rota      | `/login` (pública)                                    |
| Entry     | `pages/Login/index.tsx`                               |
| Hook      | `hooks/useAuthGate.ts`                                |
| Templates | `AuthGateMobile` · `AuthGateDesktop` (+ `AuthLayout`) |
| Atoms     | `GoogleMark`, `Button`                                |

## Fluxo

1. Ao montar, `useAuthGate` verifica sessão (`GET /auth/me`); se já logado,
   redireciona (`/onboarding` se sem `clientId`, senão `from`/`/`).
2. `handleGoogleLogin` → `window.location.href = GET /auth/google`.
3. Backend autentica, seta cookies httpOnly e redireciona de volta.
4. `handleClose` volta para a tela anterior (ou `/`).

## Estados

- `isCheckingSession` — verificando sessão existente.
- `isRedirecting` — saindo para o Google.

## Observações

- A rota de origem é preservada em `location.state.from` pelo `AuthGuard`.
- Token sentinela `"cookie"` despachado no `setCredentials`.
