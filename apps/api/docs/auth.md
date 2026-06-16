# Autenticação (`User`)

Login via **Google OAuth 2.0**. A API não armazena senhas — a identidade vem do
Google e é persistida na tabela `User`. O acesso às rotas é controlado por
**JWT** (access + refresh token) e por **papéis** (`Role`).

[↩ Voltar ao README](../README.md)

---

## Modelo `User`

| Campo          | Tipo      | Regra                                                          |
| -------------- | --------- | -------------------------------------------------------------- |
| `id`           | Int       | PK                                                             |
| `googleId`     | String    | Único — id do Google, chave da identidade                      |
| `email`        | String    | Único                                                          |
| `name`         | String    | Nome vindo do perfil Google                                    |
| `role`         | `Role`    | `CLIENT` (default) ou `OPERATOR`                               |
| `refreshToken` | String?   | **Hash bcrypt** do refresh token atual (null = sem sessão)     |
| `client`       | `Client?` | Relação 1:1 opcional — preenchida quando o usuário se cadastra |
| `createdAt`    | DateTime  | default `now()`                                                |

> Um `User` só vira "cliente completo" quando cria o `Client` (endereço). Ver
> [docs/clients.md](./clients.md).

---

## Papéis (`Role`)

```
enum Role { CLIENT | OPERATOR }
```

- **`CLIENT`** — papel padrão de quem loga pelo Google. Pode criar pedidos e
  acessar apenas os próprios dados (`/clients/me`, `/orders/my`).
- **`OPERATOR`** — administrador da pizzaria. Gerencia catálogo, pedidos de todos
  os clientes e configuração da loja.

A elevação para `OPERATOR` **não tem endpoint** — é feita manualmente no banco.

---

## Fluxo OAuth (Google)

1. O browser acessa `GET /auth/google` → redireciona para o consentimento Google.
2. O Google chama `GET /auth/google/callback`. A `GoogleStrategy` recebe o perfil
   e chama `findOrCreateUser` (cria o `User` na primeira vez, ou reaproveita pelo
   `googleId`).
3. O callback:
   - gera o par de tokens (access + refresh);
   - salva o **hash** do refresh token em `User.refreshToken`;
   - seta os dois tokens como cookies `httpOnly`;
   - redireciona para o frontend. Se o usuário **ainda não tem `Client`**, vai
     para `${FRONTEND_URL}/onboarding`; caso contrário, para `FRONTEND_URL`.

> O redirect não leva tokens na query string — tudo trafega por cookie.

---

## Tokens

| Token          | Validade | Conteúdo (payload)                   | Onde fica                         |
| -------------- | -------- | ------------------------------------ | --------------------------------- |
| `accessToken`  | 15 min   | `sub`, `email`, `role`, `hasAddress` | cookie `httpOnly`                 |
| `refreshToken` | 30 dias  | apenas `sub`                         | cookie `httpOnly` + hash no banco |

- O **access token** carrega o `role` — é ele que o `RolesGuard` consulta.
- O **refresh token** guarda só o `sub`; sua validade real depende do hash bater
  com `User.refreshToken`. Fazer logout zera esse campo e invalida qualquer
  refresh emitido antes.

### Extração do token (`JwtStrategy`)

A estratégia aceita o access token de **duas formas**, nesta ordem:

1. Header `Authorization: Bearer <token>` (útil para testes/Postman);
2. Cookie `accessToken` (fluxo normal do browser).

O `validate()` transforma o payload bruto (`JwtPayload`, com `sub`) no objeto
`req.user` (`JwtUser`, com `userId`). Essa separação está em
`src/auth/types/jwt-payload.type.ts`.

---

## Endpoints

| Método | Rota                    | Auth   | Descrição                                                           |
| ------ | ----------------------- | ------ | ------------------------------------------------------------------- |
| `GET`  | `/auth/google`          | —      | Inicia o fluxo OAuth                                                |
| `GET`  | `/auth/google/callback` | —      | Callback do Google (uso interno); seta cookies                      |
| `GET`  | `/auth/dev-token`       | —      | Gera um access token `OPERATOR` para testes locais                  |
| `GET`  | `/auth/me`              | JWT    | Dados do usuário logado (`id`, `name`, `email`, `role`, `clientId`) |
| `POST` | `/auth/refresh`         | cookie | Renova o par de tokens a partir do cookie `refreshToken`            |
| `POST` | `/auth/logout`          | JWT    | Zera `refreshToken` no banco e limpa os cookies                     |

### `GET /auth/dev-token`

Atalho de desenvolvimento: assina um access token com `sub: 0`, `role: OPERATOR`
e `hasAddress: true`, **sem** emitir refresh token. Não usar em produção.

### `GET /auth/me`

Retorna o `MeResponse`: `{ id, name, email, avatar, role, clientId }`.
`clientId` é `null` enquanto o usuário não tiver criado seu `Client`.

---

## Guards

| Guard          | Responsabilidade                                              |
| -------------- | ------------------------------------------------------------- |
| `JwtAuthGuard` | Valida o access token (cookie ou Bearer) e popula `req.user`  |
| `RolesGuard`   | Compara `req.user.role` com os papéis exigidos por `@Roles()` |

`RolesGuard` libera a rota quando **não há** `@Roles()` declarado. Por isso a
ordem `@UseGuards(JwtAuthGuard, RolesGuard)` é importante: primeiro autentica,
depois autoriza.
