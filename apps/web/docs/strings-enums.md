# Strings literais → enums / constantes

Catálogo das **strings soltas** (magic strings) encontradas no código, com
proposta de centralização. O objetivo é eliminar literais repetidas e
inconsistências, criando uma única fonte da verdade por categoria.

[↩ Voltar ao README](../README.md)

> Já centralizado hoje (modelo a seguir): `QUERY_KEYS` em
> [`src/lib/queryClient.ts`](../src/lib/queryClient.ts). Os itens abaixo devem
> seguir o mesmo padrão. Acompanhamento das ações em [`TODO.md`](../TODO.md).

---

## 1. Rotas (`navigate(...)`) — **alta prioridade**

Paths espalhados como literais em hooks e páginas. Ocorrências:

| Path                  | Nº de usos | Onde                                                              |
| --------------------- | ---------- | ----------------------------------------------------------------- |
| `/`                   | 14         | vários hooks/handlers                                             |
| `/orders`             | 5          | useMyOrders, useOrderDetail, useOrderTracking, useProfile         |
| `/cart`               | 5          | useMyOrders, useOrderDetail, useOrderTracking, usePizzaDetailData |
| `/profile`            | 4          | navegação principal                                               |
| `/login`              | 3          | AuthGuard, useAuthGate                                            |
| `/order/confirm`      | 2          | useCartData                                                       |
| `/cart/payment`       | 2          | checkout                                                          |
| `/cart/delivery`      | 2          | checkout                                                          |
| `/onboarding`         | 1          | AuthGuard, useAuthGate                                            |
| `/pizza/:id`          | dinâmico   | useHomeData                                                       |
| `/order/:id/tracking` | dinâmico   | useMyOrders, useOrderConfirm, useOrderTracking                    |
| `/orders/:id`         | dinâmico   | useMyOrders, useOrderDetail                                       |

**Proposta** — `src/constants/routes.ts`:

```ts
export const ROUTES = {
  home: "/",
  pizza: (id: number | string) => `/pizza/${id}`,
  cart: "/cart",
  delivery: "/cart/delivery",
  payment: "/cart/payment",
  login: "/login",
  onboarding: "/onboarding",
  orderConfirm: "/order/confirm",
  orderTracking: (id: number | string) => `/order/${id}/tracking`,
  myOrders: "/orders",
  orderDetail: (id: number | string) => `/orders/${id}`,
  profile: "/profile",
} as const;
```

---

## 2. Tamanhos de pizza (`small` / `medium` / `large`)

O **valor** (`"small"`…) já é um union type tipado, mas o **rótulo** está
triplicado:

| Constante     | Arquivo                             | Valores                  |
| ------------- | ----------------------------------- | ------------------------ |
| `SIZE_LABELS` | `components/molecules/SizeSelector` | Pequena / Média / Grande |
| `SIZE_LABELS` | `utils/cart.ts`                     | Pequena / Média / Grande |
| `SIZE_LABEL`  | `utils/format.ts`                   | Pequena / Média / Grande |

**Proposta** — uma única fonte (ex: `src/constants/pizza.ts`) reexportada:

```ts
export const PIZZA_SIZE = {
  small: "small",
  medium: "medium",
  large: "large",
} as const;
export const SIZE_LABEL: Record<PizzaSize, string> = {
  small: "Pequena",
  medium: "Média",
  large: "Grande",
};
export const SIZE_ORDER: PizzaSize[] = ["small", "medium", "large"];
```

---

## 3. Tipos de entrega (`delivery` / `pickup` / `dine_in`) — **inconsistente**

`DELIVERY_LABELS` está **duplicado com textos divergentes**:

| Arquivo                     | `delivery` | `pickup`            | `dine_in`        |
| --------------------------- | ---------- | ------------------- | ---------------- |
| `pages/Cart/useCartData.ts` | "Delivery" | "Retirar no balcão" | "Comer no salão" |
| `hooks/useOrderConfirm.ts`  | "Delivery" | "Retirada no local" | "Comer no salão" |

**Proposta** — `src/constants/delivery.ts` (já existe; ampliar):

```ts
export const DELIVERY_TYPE = {
  delivery: "delivery",
  pickup: "pickup",
  dineIn: "dine_in",
} as const;
export const DELIVERY_LABEL: Record<DeliveryType, string> = {
  delivery: "Delivery",
  pickup: "Retirada no local", // padronizar texto único
  dine_in: "Comer no salão",
};
```

> Decisão pendente: `dine_in` é suportado no slice mas **não é selecionável** na
> UI. Manter como rótulo ou remover? (ver [`TODO.md`](../TODO.md)).

---

## 4. Status do pedido (`OrderStatus`)

Rótulos centralizados em `ORDER_STATUS_LABEL` (`utils/format.ts`) ✅, **mas**
duplicados nos rótulos da timeline de tracking:

| Fonte                                  | Exemplos                                              |
| -------------------------------------- | ----------------------------------------------------- |
| `utils/format.ts → ORDER_STATUS_LABEL` | Aguardando, Confirmado, Em preparo, Entregue…         |
| `useOrderTracking.ts → buildStages`    | "Aguardando confirmação", "Confirmado", "Em preparo"… |

Há ainda `ORDER_STATUS_COLOR` (format.ts) e os índices de progresso espalhados
em `progressSegment` (useMyOrders) e `progressIndex` (useOrderTracking).

**Proposta** — um único mapa de status com `{ label, trackingLabel, color, step }`.

---

## 5. Métodos de pagamento (`PaymentType`)

`CASH | CREDIT | DEBIT | PIX` — comparado como literal `paymentType === "CASH"`
em `useCartData`. O tipo já vem do `@cintiago/shared`; basta evitar o literal:

```ts
export const PAYMENT_TYPE = {
  cash: "CASH",
  credit: "CREDIT",
  debit: "DEBIT",
  pix: "PIX",
} as const;
// uso: isCash = paymentType === PAYMENT_TYPE.cash
```

---

## 6. Token sentinela `"cookie"` — **magic string**

Usado para sinalizar "autenticado via cookie httpOnly, sem header Bearer".
Repetido em **4 arquivos**:

- `api/client.ts` (comparação no interceptor)
- `hooks/useAuthGate.ts`
- `hooks/useInitAuth.ts`
- `pages/Onboarding/useOnboardingForm.ts`

**Proposta** — `export const COOKIE_TOKEN = "cookie" as const;` em um único lugar
(ex: `src/constants/auth.ts`), importado por todos.

---

## 7. URL do ViaCEP — **lógica duplicada**

`https://viacep.com.br/ws/${cep}/json/` aparece em 3 arquivos, cada um
reimplementando o fetch/parse:

- `utils/cep.ts` (`lookupCep` — a versão "oficial")
- `hooks/useProfile.ts` (`fetchAddressByCep`)
- `pages/Onboarding/useOnboardingForm.ts` (inline)

**Proposta** — todos consumirem `utils/cep.ts → lookupCep`; remover as cópias.

---

## 8. Fallback `"Pizza"`

String literal usada como nome fallback quando uma metade não tem nome,
repetida em 7 arquivos (`utils/cart.ts`, `OrderMiniSummary`, `OrderDetailDesktop`,
`OrderDetailMobile`, `useOrderDetail`, `useMyOrders`, `useOrderTracking`).

**Proposta** — `export const PIZZA_NAME_FALLBACK = "Pizza";` ou um helper
`pizzaItemLabel(...)` único (já existe parcialmente em `utils/cart.ts`).

---

## 9. Outras literais menores

| Literal                             | Onde                                     | Sugestão                           |
| ----------------------------------- | ---------------------------------------- | ---------------------------------- |
| `"~%d min"` / `"30–45 min"`         | já centralizado em `formatEtaMinutes` ✅ | manter                             |
| Toast `"%s adicionado ao carrinho"` | `useHomeData`                            | template em constante de mensagens |
| `"você"` (fallback de nome)         | `useOnboardingForm`                      | constante de fallback              |

---

## Resumo da prioridade

1. **Rotas** (`ROUTES`) — maior volume e risco de typo.
2. **Entrega** (`DELIVERY_LABEL`) — já há **inconsistência** em produção.
3. **Tamanho** (`SIZE_LABEL`) — triplicado.
4. **Status** — consolidar label/timeline/cor/step.
5. **Sentinela `"cookie"`** e **ViaCEP** — magic strings/lógica duplicada.
