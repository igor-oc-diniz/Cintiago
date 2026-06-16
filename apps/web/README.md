# Cintiago Web

Frontend da pizzaria Cintiago — **React 19 + Vite + TypeScript**, com Atomic
Design, React Query e Redux. Faz parte do monorepo (`apps/web` = frontend,
`apps/api` = backend; tipos compartilhados em `@cintiago/shared`).

> Documentação principal do frontend. Os detalhes de cada área ficam nos
> documentos linkados abaixo.

---

## Índice

- [Stack](#stack)
- [Setup](#setup)
- [Scripts](#scripts)
- [Documentação](#documentação)
  - [Arquitetura](#arquitetura)
  - [Componentes (Atomic Design)](#componentes-atomic-design)
  - [Páginas](#páginas)
  - [Regras de negócio](#regras-de-negócio)
- [Convenções](#convenções)

---

## Stack

| Camada               | Tecnologia                                            |
| -------------------- | ----------------------------------------------------- |
| Build / dev          | Vite 6 + React 19 + TypeScript                        |
| Roteamento           | React Router DOM 7 (lazy + Suspense)                  |
| Estado do servidor   | TanStack React Query 5                                |
| Estado do cliente    | Redux Toolkit + `redux-persist` (só o carrinho)       |
| Formulários          | React Hook Form + Zod                                 |
| HTTP                 | Axios (instância única com interceptors)              |
| Estilo               | Tailwind CSS 4 + tokens CSS + `clsx`/`tailwind-merge` |
| Tipos compartilhados | `@cintiago/shared`                                    |

Detalhes em [`docs/architecture.md`](./docs/architecture.md).

---

## Setup

Na raiz do monorepo:

```bash
npm install
```

Variáveis de ambiente (`apps/web/.env.development`):

```env
VITE_API_URL=http://localhost:3000
```

Com a API rodando (ver [`apps/api/README.md`](../api/README.md)), inicie o front:

```bash
cd apps/web
npm run dev          # Vite em http://localhost:5174 (default)
```

> O alias `@` aponta para `src/` (configurado em `vite.config.ts`).

---

## Scripts

| Script            | Descrição                          |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Servidor de desenvolvimento (Vite) |
| `npm run build`   | `tsc -b` + build de produção       |
| `npm run preview` | Preview do build                   |
| `npm run lint`    | ESLint                             |

---

## Documentação

### Arquitetura

[`docs/architecture.md`](./docs/architecture.md) — estrutura de pastas,
roteamento + guards, camada de API e adapters, divisão de estado
(React Query × Redux) e fluxo de autenticação.

### Componentes (Atomic Design)

[`docs/components.md`](./docs/components.md) — inventário completo
(atoms → molecules → organisms → templates) com propósito e props.

### Páginas

[`docs/pages/`](./docs/pages/README.md) — uma página por rota. Atalhos:

| Página                                                 | Rota                  |
| ------------------------------------------------------ | --------------------- |
| [Home (Cardápio)](./docs/pages/home.md)                | `/`                   |
| [Detalhe / Montagem](./docs/pages/pizza-detail.md)     | `/pizza/:id`          |
| [Carrinho](./docs/pages/cart.md)                       | `/cart`               |
| [Seleção de entrega](./docs/pages/select-delivery.md)  | `/cart/delivery`      |
| [Seleção de pagamento](./docs/pages/select-payment.md) | `/cart/payment`       |
| [Login](./docs/pages/login.md)                         | `/login`              |
| [Onboarding](./docs/pages/onboarding.md)               | `/onboarding`         |
| [Confirmação](./docs/pages/order-confirm.md)           | `/order/confirm`      |
| [Acompanhamento](./docs/pages/order-tracking.md)       | `/order/:id/tracking` |
| [Meus pedidos](./docs/pages/my-orders.md)              | `/orders`             |
| [Detalhe do pedido](./docs/pages/order-detail.md)      | `/orders/:id`         |
| [Perfil](./docs/pages/profile.md)                      | `/profile`            |

### Regras de negócio

[`docs/business-rules.md`](./docs/business-rules.md) — cálculo de preço
(meia-a-meia, bordas, adicionais com deduplicação), carrinho, entrega,
pagamento/troco, pedido mínimo, status da loja, ETA e ciclo de vida do pedido.

---

## Convenções

- **Atomic Design estrito** — nunca pule níveis; sem componentes definidos inline
  em páginas.
- **Responsividade** — páginas com layouts estruturalmente diferentes usam
  `useBreakpoint` (`*.mobile.tsx` / `*.desktop.tsx`).
- **Estado** — dados do servidor no React Query, estado do cliente no Redux;
  nunca dados de API no Redux.
- **Tipos** — zero `any`; props sempre com interface dedicada.
- **Estilo** — tokens de design para cores; sem hex hardcoded nem `style` inline.
- **Backend** — `src/api/` é a fonte da verdade dos contratos.
