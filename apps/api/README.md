# Cintiago API

API de pizzaria construída com **NestJS + Prisma + PostgreSQL** (Supabase).
Faz parte do monorepo Cintiago (`apps/api` = backend, `apps/web` = frontend).

> Esta é a documentação principal do backend. As regras de negócio detalhadas de
> cada entidade ficam em arquivos separados na pasta [`docs/`](./docs), linkados
> na seção [Entidades & regras de negócio](#entidades--regras-de-negócio).

---

## Índice

- [Stack](#stack)
- [Setup](#setup)
- [Rodando](#rodando)
- [Arquitetura](#arquitetura)
- [Autenticação & autorização](#autenticação--autorização)
- [Entidades & regras de negócio](#entidades--regras-de-negócio)
- [Convenções de código](#convenções-de-código)
- [Testes](#testes)

---

## Stack

| Camada         | Tecnologia                                               |
| -------------- | -------------------------------------------------------- |
| Framework      | NestJS + TypeScript                                      |
| ORM            | Prisma                                                   |
| Banco          | PostgreSQL (Supabase)                                    |
| Autenticação   | Passport.js + JWT + Google OAuth 2.0                     |
| Validação      | `class-validator` + `class-transformer` (ValidationPipe) |
| Tipos compart. | `@cintiago/shared` (DTOs usados por api e web)           |

---

## Setup

```bash
npm install
```

Crie o arquivo `.env` em `apps/api/`:

```env
DATABASE_URL=                # string de conexão PostgreSQL (Supabase)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
JWT_SECRET=
FRONTEND_URL=http://localhost:5174   # opcional; default já aponta pro Vite local
```

Aplique as migrations:

```bash
npx prisma migrate dev
```

---

## Rodando

```bash
npm run start:dev    # desenvolvimento (watch)
npm run start:prod   # produção
```

A API sobe em `http://localhost:3000` (ou `PORT`). CORS liberado para
`http://localhost:5174` com `credentials: true` (necessário pelos cookies `httpOnly`).

---

## Arquitetura

Cada módulo segue o mesmo fluxo em camadas:

```
DTO  →  Controller  →  Service  →  PrismaService  →  Banco
(valida)  (rotas/guards)  (regra de negócio)   (acesso a dados)
```

- **DTO** — define o formato de entrada e as validações (`class-validator`).
- **Controller** — declara rotas, aplica `@Roles()` + guards.
- **Service** — concentra a regra de negócio e o acesso ao Prisma.
- **PrismaModule** é `@Global()` — não precisa ser importado em cada módulo.

Módulos registrados (`app.module.ts`): `auth`, `clients`, `pizzas`, `ingredients`,
`ingredient-prices`, `crusts`, `products`, `payments`, `orders`, `store`.

---

## Autenticação & autorização

Login via **Google OAuth 2.0**, com tokens em cookies `httpOnly`.
Detalhes completos do fluxo, refresh token e endpoints em
**[`docs/auth.md`](./docs/auth.md)**.

### Papéis (`Role`)

| Papel      | Acesso                                                              |
| ---------- | ------------------------------------------------------------------- |
| `OPERATOR` | Administrativo — mutações em catálogo, gestão de pedidos e clientes |
| `CLIENT`   | Cliente autenticado — cria pedidos e consulta os próprios dados     |

O `RolesGuard` lê o `@Roles()` da rota; sem decorator a rota é liberada
para qualquer usuário autenticado (ou pública, se não houver `JwtAuthGuard`).

---

## Entidades & regras de negócio

| Entidade / domínio        | Documento                                    | Resumo                                                            |
| ------------------------- | -------------------------------------------- | ----------------------------------------------------------------- |
| Autenticação (`User`)     | [docs/auth.md](./docs/auth.md)               | OAuth Google, JWT, refresh token, papéis                          |
| Clientes (`Client`)       | [docs/clients.md](./docs/clients.md)         | Cadastro/endereço do cliente, auto-cadastro via `/me`             |
| Pizzas (`Pizza`)          | [docs/pizzas.md](./docs/pizzas.md)           | Catálogo, preço por tamanho, ingredientes da receita              |
| Ingredientes & preços     | [docs/ingredients.md](./docs/ingredients.md) | `Ingredient` + `IngredientPrice` (adicionais cobrados)            |
| Bordas (`Crust`)          | [docs/crusts.md](./docs/crusts.md)           | Bordas opcionais com preço por tamanho                            |
| Produtos (`Product`)      | [docs/products.md](./docs/products.md)       | Itens avulsos (bebidas, sobremesas)                               |
| Pagamentos (`Payment`)    | [docs/payments.md](./docs/payments.md)       | Métodos de pagamento e `PaymentType`                              |
| Pedidos (`Order`)         | [docs/orders.md](./docs/orders.md)           | Carrinho, cálculo de total, status, troco, ETA e avaliações       |
| Estabelecimento (`Store`) | [docs/store.md](./docs/store.md)             | Singleton de configuração da loja (taxa, horários, tempos de ETA) |

> Diagrama do banco: [`docs/pizzaria-schema.pdf`](../../docs/pizzaria-schema.pdf) ·
> DDL de referência: [`docs/schema.sql`](../../docs/schema.sql) ·
> Coleção Postman: [`docs/Cintiago.postman_collection.json`](../../docs/Cintiago.postman_collection.json)

---

## Convenções de código

### Tratamento de erros do Prisma

`src/common/prisma-errors.helper.ts` → `handlePrismaError(error, resource)`
traduz erros conhecidos do Prisma em exceptions HTTP:

| Código Prisma | Exception             | Significado                       |
| ------------- | --------------------- | --------------------------------- |
| `P2025`       | `NotFoundException`   | Registro não encontrado           |
| `P2002`       | `ConflictException`   | Violação de unicidade             |
| `P2003`       | `BadRequestException` | FK inválida (recurso relacionado) |
| `P2000`       | `BadRequestException` | Valor longo demais para o campo   |

Erros desconhecidos são relançados sem alteração.

### ValidationPipe global (`main.ts`)

```ts
new ValidationPipe({
  whitelist: true, // remove props não declaradas no DTO
  forbidNonWhitelisted: true, // rejeita props desconhecidas (400)
  transform: true, // converte payload para a instância do DTO
});
```

### Valores monetários

Preços e totais são `Decimal` no Prisma. Nos cálculos do `OrdersService` eles
são convertidos para `number` via `Number(...)`.

---

## Testes

```bash
npm run test       # unitários
npm run test:e2e   # end-to-end
npm run test:cov   # cobertura
```
