# Arquitetura — Cintiago Web

Visão geral de como o frontend é organizado: stack, estrutura de pastas,
roteamento, camada de API, gerenciamento de estado e fluxo de autenticação.

[↩ Voltar ao README](../README.md)

---

## Stack

| Camada               | Tecnologia                                                                    |
| -------------------- | ----------------------------------------------------------------------------- |
| Build / dev server   | Vite 6 + React 19 + TypeScript                                                |
| Roteamento           | React Router DOM 7 (`createBrowserRouter`, lazy + Suspense)                   |
| Estado do servidor   | TanStack React Query 5                                                        |
| Estado do cliente    | Redux Toolkit + `redux-persist` (apenas o carrinho)                           |
| Formulários          | React Hook Form + Zod + `@hookform/resolvers`                                 |
| HTTP                 | Axios (instância única com interceptors)                                      |
| Estilo               | Tailwind CSS 4 + tokens CSS (`cintiago-tokens.css`) + `clsx`/`tailwind-merge` |
| Ícones               | `lucide-react` + ícones próprios em `atoms/Icons`                             |
| Toasts               | `sonner`                                                                      |
| Tipos compartilhados | `@cintiago/shared` (DTOs usados por api e web)                                |

A filosofia de componentização (Atomic Design), responsividade e boas práticas
segue as convenções do projeto — este documento descreve **como o código
está organizado hoje**, não as regras de estilo.

---

## Estrutura de pastas

```
src/
├── api/              # Funções de chamada HTTP (1 arquivo por recurso) + adapters
├── components/       # Atomic Design (atoms → molecules → organisms → templates)
├── constants/        # Constantes globais (endereço default do formulário)
├── hooks/            # Custom hooks de domínio (useCart, useAuth, useOrderTracking…)
├── lib/              # queryClient + QUERY_KEYS centralizadas
├── pages/            # Uma pasta por rota; index.tsx escolhe mobile/desktop
├── router/           # Definição de rotas + AuthGuard
├── store/            # Redux: store, slices (cart, auth, order), hooks tipados
├── types/            # Tipos de domínio do frontend (domain.ts)
├── utils/            # Funções puras (format, cart, order, cep, cn)
└── main.tsx          # Bootstrap: Provider Redux + PersistGate + QueryClient + Router
```

### Anatomia de uma página

Toda página segue o mesmo padrão de 3 partes:

```
pages/Home/
├── index.tsx          # entry: chama o hook de dados e decide layout via useBreakpoint
├── useHomeData.ts      # toda a lógica/estado da página (queries, handlers)
├── Home.mobile.tsx     # layout mobile (recebe os dados via props)
└── Home.desktop.tsx    # layout desktop (recebe os mesmos dados via props)
```

O `index.tsx` nunca contém lógica de negócio — apenas:

```tsx
export default function Home() {
  const data = useHomeData();
  const { isDesktop } = useBreakpoint();
  return isDesktop ? <HomeDesktop {...data} /> : <HomeMobile {...data} />;
}
```

> Páginas mais simples (Login, MyOrders, OrderConfirm, OrderDetail,
> OrderTracking, Profile) consomem diretamente um hook de domínio em `hooks/`
> e renderizam um template, sem o trio `.mobile`/`.desktop` próprio.

---

## Roteamento

Definido em [`src/router/index.tsx`](../src/router/index.tsx) com
`createBrowserRouter`. Todas as páginas são carregadas com `lazy()` + `Suspense`
(code-splitting), sob um `RootLayout` comum.

| Rota                  | Página         | Proteção                       |
| --------------------- | -------------- | ------------------------------ |
| `/`                   | Home           | pública                        |
| `/pizza/:id`          | PizzaDetail    | pública                        |
| `/cart`               | Cart           | pública                        |
| `/cart/delivery`      | SelectDelivery | pública                        |
| `/cart/payment`       | SelectPayment  | pública                        |
| `/login`              | Login          | pública                        |
| `/onboarding`         | Onboarding     | login (perfil **não** exigido) |
| `/order/confirm`      | OrderConfirm   | login + perfil completo        |
| `/order/:id/tracking` | OrderTracking  | login + perfil completo        |
| `/orders`             | MyOrders       | login + perfil completo        |
| `/orders/:id`         | OrderDetail    | login + perfil completo        |
| `/profile`            | Profile        | login + perfil completo        |

### AuthGuard

[`src/router/AuthGuard.tsx`](../src/router/AuthGuard.tsx) protege grupos de
rotas com base em dois sinais do `authSlice`:

- **`isLoggedIn`** (`!!user`) — sem login → redireciona para `/login`,
  guardando a rota de origem em `location.state.from`.
- **`hasCompletedProfile`** (`!!user.clientId`) — logado mas sem cadastro de
  cliente → redireciona para `/onboarding`.

`requireProfile={false}` é usado só na rota de onboarding (precisa estar logado,
mas ainda não tem perfil).

> ⚠️ Carrinho, entrega e pagamento são **públicos**. O login só é exigido na
> confirmação do pedido (`/order/confirm`). Ver [regras de negócio](./business-rules.md).

---

## Camada de API

Cada recurso tem um arquivo em [`src/api/`](../src/api) com funções finas que
só fazem a chamada HTTP e devolvem `r.data` — sem lógica de negócio.

### Instância Axios (`api/client.ts`)

- `baseURL` = `import.meta.env.VITE_API_URL`, `withCredentials: true`
  (cookies httpOnly para auth).
- **Request interceptor:** injeta `Authorization: Bearer <token>` a partir do
  `authSlice`. Ignora o valor sentinela `"cookie"` (auth via cookie httpOnly não
  precisa do header).
- **Response interceptor (401):** tenta `POST /auth/refresh` **uma vez**
  (`_retry`) e refaz a requisição original; se falhar, despacha `auth/logout`.

### Adapters DTO → domínio

Alguns recursos convertem o DTO cru do backend para o tipo de domínio do
frontend (`src/types/domain.ts`), normalizando preços de `Decimal` (string)
para `number` e achatando a estrutura por tamanho:

| Arquivo              | Adapter           | O que faz                                                   |
| -------------------- | ----------------- | ----------------------------------------------------------- |
| `api/pizzas.ts`      | `adaptPizza`      | `priceSmall/Medium/Large` → `prices[]`; achata ingredientes |
| `api/crusts.ts`      | `adaptCrust`      | preços por tamanho → `prices[]`                             |
| `api/ingredients.ts` | `adaptIngredient` | `ingredientPrice` → `prices[]`                              |

> `payments`, `products`, `orders`, `store` e `clients` usam os DTOs do
> `@cintiago/shared` diretamente, sem adapter.

---

## Gerenciamento de estado

A divisão segue a regra de ouro:
**dados do servidor no React Query, estado do cliente no Redux.**

### React Query (estado do servidor)

- Configurado em [`src/lib/queryClient.ts`](../src/lib/queryClient.ts):
  `staleTime` 5 min, `gcTime` 10 min, `retry: 1`, sem refetch on focus.
- **Todas** as chaves vivem em `QUERY_KEYS` (mesmo arquivo) — nunca strings
  soltas:

  ```ts
  QUERY_KEYS.pizzas; // ["pizzas"]
  QUERY_KEYS.pizza(id); // ["pizzas", id]
  QUERY_KEYS.order(id); // ["orders", id]
  QUERY_KEYS.myOrders; // ["orders", "my"]
  QUERY_KEYS.storeInfo; // ["store", "info"]
  ```

- `useStoreInfo` usa `staleTime: Infinity` (config global da loja muda raramente)
  e expõe `fetchFreshStatus()` para ignorar o cache no momento do checkout.
- `useOrderTracking` usa `refetchInterval: 30_000` (polling do status).

### Redux (estado do cliente persistido)

`store/store.ts` combina 3 slices, mas **só o `cart` é persistido**
(`whitelist: ["cart"]`, `redux-persist` em `localStorage`):

| Slice   | Persistido? | Conteúdo                                               |
| ------- | ----------- | ------------------------------------------------------ |
| `cart`  | ✅ sim      | itens, subtotal, tipo de entrega, pagamento, troco     |
| `auth`  | ❌ não      | `token`, `user` — sempre re-derivado de `GET /auth/me` |
| `order` | ❌ não      | `activeOrder` — pedido recém-criado, efêmero           |

**Migrations do `redux-persist`** (`cart` version 3):

- **v1→v2:** introduziu `paymentType`; limpa pagamento para forçar re-seleção.
- **v2→v3:** entrega e pagamento nunca vêm pré-selecionados de sessões
  anteriores — são escolha consciente a cada pedido.

> Detalhes do `cartSlice` (actions, serialização para `POST /orders`) estão em
> [regras de negócio](./business-rules.md).

---

## Fluxo de autenticação

1. **Login:** `Login` → `useAuthGate` → redireciona para `GET /auth/google`
   (OAuth). O backend seta cookies httpOnly (`accessToken` 15 min,
   `refreshToken` 30 d) e redireciona de volta.
2. **Hidratação da sessão:** `useInitAuth` (montado no `RootLayout`) e
   `useAuthGate` chamam `GET /auth/me`. Em sucesso, despacham
   `setCredentials({ token: "cookie", user })` — o token sentinela `"cookie"`
   sinaliza "autenticado via cookie, não preciso de header".
3. **Roteamento pós-login:** se `user.clientId` é `null` → `/onboarding`;
   senão → rota de origem (`from`) ou `/`.
4. **Refresh automático:** qualquer `401` dispara `POST /auth/refresh` uma vez
   via interceptor; falha → logout.
5. **Logout:** `useAuth().logout` → `POST /auth/logout` (invalida no backend) +
   `dispatch(logout())` (limpa o slice).

> O sentinela `"cookie"` é um magic string repetido em 4 arquivos — candidato a
> constante centralizada.
