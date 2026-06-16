# Regras de negócio — Cintiago Web

Como o frontend trata preço, carrinho, entrega, pagamento, ETA e ciclo de vida
do pedido. **O backend é a fonte da verdade dos valores** — o frontend só
replica os cálculos para exibição/preview; o total gravado é sempre o do backend.

[↩ Voltar ao README](../README.md)

---

## 1. Cálculo de preço da pizza

Implementado em duas frentes que usam **o mesmo algoritmo do backend**:

- **Preview (montagem):** `pages/PizzaDetail/usePizzaDetailData.ts`
- **Recálculo (pedidos existentes):** `utils/order.ts → computeOrderItemCurrentPrice`

### Algoritmo

```
preço unitário = max(preço de cada metade) + preço da borda

onde, para cada metade:
  preço da metade = preço da pizza (no tamanho) + Σ adicionais ainda não cobrados
```

Regras-chave:

1. **Por tamanho:** todo preço (pizza, borda, ingrediente) depende do tamanho
   selecionado (`small`/`medium`/`large`).
2. **Meia-a-meia:** quando há 2 metades, cobra-se o **maior** preço entre as duas
   (não a média nem a soma).
3. **Deduplicação cross-half:** um adicional escolhido nas duas metades é
   **cobrado uma única vez** (controlado por um `Set<ingredientId>` compartilhado
   entre as metades).
4. **Ingredientes default são grátis:** os ingredientes que já compõem a pizza
   têm preço 0; só os **adicionais** (não-default, com preço > 0) entram na conta.
5. **Borda:** somada uma vez ao preço unitário, no tamanho selecionado.

```
unitPrice = pizzaPrice + crustPrice
total     = unitPrice × quantidade
```

> O recálculo em `computeOrderItemCurrentPrice` reflete **preços vigentes** — se
> o preço de um ingrediente mudou desde o pedido original, "Repetir pedido" usa o
> preço atual. O `OrderItem.price` congelado no backend é o valor histórico.

---

## 2. Carrinho (`store/slices/cartSlice.ts`)

Estado persistido em `localStorage` via `redux-persist`. Dois tipos de item:

- **`CartPizzaItem`** — `size`, `crustId`, `quantity`, `halves[]` (1 ou 2),
  `notes`, `unitPrice`. Tem um `id` uuid **local** (não existe na API).
- **`CartProductItem`** — `productId`, `quantity`, `unitPrice`.

### Regras de mesclagem

- **`addPizza`:** se já existe item **idêntico** (mesmas metades, tamanho, borda
  e notas), apenas incrementa a quantidade; senão cria novo.
- **`addProduct`:** se o `productId` já está no carrinho, incrementa; senão cria.
- **`updateQuantity`:** quantidade ≤ 0 remove o item.
- **`notes`** são normalizadas (`trim()` → `null` se vazio) ao adicionar/atualizar.

### Subtotal

`subtotal = Σ (unitPrice × quantity)` recalculado a cada mutação
(`calcSubtotal`). **Não inclui taxa de entrega** (somada só na exibição/checkout).

### Edição de pizza

`PizzaDetail` abre em modo edição quando recebe `location.state.item`
(`isEditMode`). O botão muda para "Atualizar" e, ao confirmar, despacha
`updatePizzaItem` (em vez de `addPizza`) e volta para o carrinho (`navigate(-1)`).

### Serialização para `POST /orders`

`serializeCartToOrderPayload(items, paymentId, changeFor)` converte o estado para
o payload exato da API:

- só inclui `crustId` se houver borda;
- só inclui `notes` se houver observação;
- só inclui `ingredients` de uma metade se houver adicionais;
- só inclui `changeFor` se truthy (pagamento em dinheiro);
- nomes de exibição (`pizzaName`, `ingredientName`, `crustName`) **não** vão
  para a API — são só para a UI.

> `clientId` **nunca** é enviado no body — o backend resolve pelo JWT.

---

## 3. Entrega (`deliveryType`)

- Valores no carrinho: `"delivery"`, `"pickup"`, `"dine_in"` (o slice aceita os
  três), mas a UI de seleção (`useDeliverySelection`) só oferece
  **`delivery`** e **`pickup`** — `dine_in` é um caminho atualmente morto.
- Trocar o tipo de entrega **zera o pagamento e o troco** (`setDelivery`),
  garantindo re-seleção consciente.
- **Taxa de entrega:** `deliveryFee` vem de `GET /store/info` (`useStoreInfo`).
  Aplicada **só** quando `deliveryType === "delivery"`; em `pickup` a taxa é 0.

```
fee   = deliveryType === "delivery" ? store.deliveryFee : 0
total = subtotal + fee
```

> Os rótulos de entrega estão **duplicados e inconsistentes** entre
> `useCartData` ("Retirar no balcão") e `useOrderConfirm` ("Retirada no local").

---

## 4. Pagamento

- Métodos vêm de `GET /payments` (`PaymentDTO`), com `type` ∈
  `CASH | CREDIT | DEBIT | PIX`.
- A decisão "é dinheiro?" usa **o `type`**, não o nome:
  `isCash = paymentType === "CASH"`.
- **Troco (`changeFor`):** só relevante para pagamento em dinheiro. O input é
  uma string local; o valor numérico vive no carrinho (`setChangeFor` via
  `parseTroco`, que converte `"R$ 12,50"` → `12.5`).
- Trocar o método de pagamento **zera o troco** (`setPayment`).

---

## 5. Pedido mínimo

`minOrderValue` vem de `GET /store/info`. Validado sobre o **subtotal** (sem a
taxa de entrega) em `useCartData`:

```
meetsMinimum = minOrderValue == null || subtotal >= minOrderValue
```

Quando não atingido, o botão de finalizar fica bloqueado e o `checkoutHint`
informa quanto falta. A ordem de prioridade da mensagem é:
**mínimo → escolher entrega → escolher pagamento**.

```
ready = !isEmpty && deliveryType && paymentName && meetsMinimum
```

---

## 6. Status da loja (aberto/fechado)

- `isOpen` vem de `GET /store/info` e é exibido no `Header` via
  `StoreStatusBadge`.
- **No checkout**, `useCartData.handleCheckout` chama
  `useStoreInfo.fetchFreshStatus()` — uma consulta **fresca** (ignora o cache)
  para garantir que a loja não fechou desde que a página carregou:
  - aberta → segue para `/order/confirm`;
  - fechada → abre `StoreClosedModal`;
  - erro na consulta → **não trava o usuário**, segue para a confirmação.

---

## 7. ETA (tempo estimado)

Mesma fórmula do `computeEta` do backend, em `useStoreInfo.computeEtaMinutes`:

```
ETA = basePrepMinutes + perPizzaMinutes × (nº de pizzas) + (delivery ? deliveryMinutes : 0)
```

- **Vitrine (pré-pedido):** calculado no front em `SelectDelivery`.
- **Pós-pedido:** usa `order.estimatedDeliveryMinutes` (vindo do backend) em
  `OrderConfirm` e `OrderTracking`.
- Formatação: `formatEtaMinutes(min)` → `"~25 min"` (vazio se `null`).

---

## 8. Ciclo de vida do pedido (`OrderStatus`)

```
pending → confirmed → preparing → delivering → delivered
                                              ↘ cancelled
```

| Status       | Label (UI)        | Timeline (índice) |
| ------------ | ----------------- | ----------------- |
| `pending`    | Aguardando        | 0                 |
| `confirmed`  | Confirmado        | 1                 |
| `preparing`  | Em preparo        | 2                 |
| `delivering` | Saiu para entrega | 3                 |
| `delivered`  | Entregue          | 4                 |
| `cancelled`  | Cancelado         | — (fora da linha) |

- **Pedidos ativos** (em "Meus Pedidos"): `pending`, `confirmed`, `preparing`,
  `delivering`, `delivered`. **Passados:** `cancelled` (e `delivered` migra para
  histórico após visualização).
- **Navegação contextual** (`handleOpenOrder`): `delivered` → detalhe
  (`/orders/:id`); demais status → tracking (`/order/:id/tracking`).
- **Tracking** faz polling a cada 30 s (`refetchInterval`).
- Os rótulos da timeline estão **duplicados** em `useOrderTracking.buildStages`
  e em `ORDER_STATUS_LABEL` (`utils/format.ts`).

---

## 9. Avaliação do pedido (rating)

- `POST /orders/:id/rating` com `{ stars, comment? }` (`useOrderDetail`).
- Disponível para pedidos `delivered`. Após enviar, invalida
  `QUERY_KEYS.order(id)`. A avaliação existente vem em `order.rating`.

---

## 10. Repetir pedido

Presente em `useMyOrders`, `useOrderDetail` e `useOrderTracking` (lógica
**idêntica** triplicada — candidata a hook compartilhado):

1. `clearCart()`;
2. re-adiciona cada item de pizza com `unitPrice = computeOrderItemCurrentPrice`
   (preço **atual**, não o histórico);
3. re-adiciona produtos com `product.price`;
4. navega para `/cart`.

---

## 11. Onboarding (cadastro de cliente)

- Exigido quando `user.clientId` é `null` (perfil incompleto).
- Coleta telefone + endereço, com **autopreenchimento via CEP** (ViaCEP).
- Validações locais: telefone ≥ 10 dígitos, CEP/rua/número/bairro/cidade
  obrigatórios. Máscaras de telefone e CEP aplicadas na digitação.
- Em sucesso (`POST /clients/me`), refaz `GET /auth/me` para atualizar o
  `clientId` e redireciona para a rota de origem (ou `/cart`).

> A lógica de busca por CEP está **reimplementada** em 3 lugares
> (`utils/cep.ts`, `useProfile`, `useOnboardingForm`) em vez de reusar
> `utils/cep.ts → lookupCep`.
