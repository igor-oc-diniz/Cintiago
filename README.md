# Cintiago 🍕

API de gerenciamento de pizzaria construída com NestJS, Prisma e PostgreSQL.

## Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** NestJS 11
- **ORM:** Prisma 7 (PostgreSQL via Supabase)
- **Auth:** Passport.js — Google OAuth 2.0 + JWT
- **Validação:** class-validator + class-transformer
- **Monorepo:** npm workspaces (`apps/api`, `apps/web`)

## Estrutura do projeto

```
cintiago/
├── apps/
│   ├── api/          # Backend NestJS
│   └── web/          # Frontend (em desenvolvimento)
├── docs/             # Collection Postman e schema do banco
└── package.json      # Workspace root
```

## Módulos da API

| Módulo              | Endpoints      | Acesso                              |
|---------------------|----------------|-------------------------------------|
| `pizzas`            | CRUD completo  | GET público / mutações: OPERATOR    |
| `ingredients`       | CRUD completo  | GET público / mutações: OPERATOR    |
| `products`          | CRUD completo  | GET público / mutações: OPERATOR    |
| `crusts`            | CRUD completo  | GET público / mutações: OPERATOR    |
| `payments`          | CRUD completo  | GET público / mutações: OPERATOR    |
| `clients`           | CRUD completo  | OPERATOR                            |
| `ingredient-prices` | CRUD completo  | OPERATOR                            |
| `orders`            | GET, PATCH, POST | GET/PATCH: OPERATOR / POST: CLIENT |
| `auth`              | OAuth, JWT     | Público                             |

## Autenticação

O fluxo de auth usa Google OAuth 2.0 e retorna um JWT:

```
GET /auth/google           → redireciona para o Google
GET /auth/google/callback  → retorna { access_token }
GET /auth/dev-token        → gera token de OPERATOR para testes locais
```

O token JWT deve ser enviado no header:

```
Authorization: Bearer <token>
```

Roles disponíveis: `OPERATOR`, `CLIENT`.

## Como rodar localmente

### Pré-requisitos

- Node.js 20+
- PostgreSQL (ou conta no Supabase)

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie o arquivo `apps/api/.env`:

```env
DATABASE_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
JWT_SECRET=
```

### 3. Rodar as migrations

```bash
cd apps/api
npx prisma migrate dev
```

### 4. Iniciar a API

```bash
# Na raiz do projeto
npm run api
```

A API estará disponível em `http://localhost:3000`.

## Testando com Postman

Importe a collection disponível em `docs/Cintiago.postman_collection.json`.

Para endpoints protegidos, use `GET /auth/dev-token` para obter um token de OPERATOR e configure-o como Bearer Token na collection.

## Licença

Veja [LICENSE](LICENSE).
