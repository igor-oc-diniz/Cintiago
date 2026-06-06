# Cintiago API

API de pizzaria construída com NestJS + Prisma + PostgreSQL (Supabase).

## Stack

- NestJS + TypeScript
- Prisma ORM
- PostgreSQL via Supabase
- Passport.js + JWT (Google OAuth 2.0)
- `class-validator` + `class-transformer`

## Setup

```bash
npm install
```

Crie o arquivo `.env` em `apps/api/`:

```env
DATABASE_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
JWT_SECRET=
```

## Rodando

```bash
# desenvolvimento
npm run start:dev

# produção
npm run start:prod
```

## Autenticação

O fluxo de autenticação usa Google OAuth 2.0 com tokens armazenados em cookies `httpOnly`.

### Fluxo OAuth

1. Abrir `GET /auth/google` no browser
2. Após login, o callback seta dois cookies `httpOnly`:
   - `accessToken` — expira em 15 minutos
   - `refreshToken` — expira em 30 dias
3. O browser envia os cookies automaticamente em toda requisição

### Endpoints

| Método | Rota                    | Auth   | Descrição                               |
| ------ | ----------------------- | ------ | --------------------------------------- |
| `GET`  | `/auth/google`          | —      | Inicia fluxo OAuth                      |
| `GET`  | `/auth/google/callback` | —      | Callback do Google (uso interno)        |
| `GET`  | `/auth/dev-token`       | —      | Gera token OPERATOR para testes locais  |
| `POST` | `/auth/refresh`         | cookie | Renova tokens via cookie `refreshToken` |
| `POST` | `/auth/logout`          | Bearer | Invalida refresh token e limpa cookies  |

### Roles

- `OPERATOR` — acesso administrativo (mutações em pizzas, pedidos, clientes etc.)
- `CLIENT` — acesso do cliente autenticado (criar pedido, ver próprios pedidos)

## Módulos

| Módulo              | GETs públicos | Mutações                                                         |
| ------------------- | ------------- | ---------------------------------------------------------------- |
| `pizzas`            | ✅            | `OPERATOR`                                                       |
| `ingredients`       | ✅            | `OPERATOR`                                                       |
| `products`          | ✅            | `OPERATOR`                                                       |
| `payments`          | ✅            | `OPERATOR`                                                       |
| `crusts`            | ✅            | `OPERATOR`                                                       |
| `clients`           | —             | `OPERATOR` (exceto `/me` → `CLIENT`)                             |
| `ingredient-prices` | —             | `OPERATOR`                                                       |
| `orders`            | —             | `OPERATOR` (exceto `POST /orders` e `GET /orders/my` → `CLIENT`) |

## Testes

```bash
npm run test
npm run test:e2e
npm run test:cov
```
