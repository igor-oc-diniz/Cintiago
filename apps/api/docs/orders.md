# Pedidos (`Order`)

O coração do sistema. Um pedido reúne **itens de pizza** (com metades, borda e
adicionais), **produtos avulsos**, forma de pagamento e entrega. Todo o cálculo
de preço acontece **no backend** — o cliente nunca envia valores, apenas o que
quer. O pedido é gravado dentro de uma `$transaction` para garantir consistência.

[↩ Voltar ao README](../README.md)

---

## Modelo de dados

Um pedido é uma árvore de entidades:

```
Order
├── OrderItem (uma pizza pedida: tamanho, quantidade, borda, notas)
│   └── OrderItemHalf (1 ou 2 metades)
│       └── OrderItemHalfIngredient (adicionais daquela metade)
├── OrderProduct (produtos avulsos)
└── Rating (avaliação, 1:1 opcional)
```

### `Order`

| Campo          | Tipo          | Regra                                                  |
| -------------- | ------------- | ------------------------------------------------------ |
| `id`           | Int           | PK                                                     |
| `clientId`     | Int           | FK → `Client` (resolvido pelo JWT, nunca vem do corpo) |
| `paymentId`    | Int           | FK → `Payment`                                         |
| `subtotal`     | Decimal?      | Soma de itens + produtos (sem entrega)                 |
| `deliveryFee`  | Decimal?      | Taxa de entrega aplicada (0 se `pickup`)               |
| `total`        | Decimal?      | `subtotal + deliveryFee`                               |
| `changeFor`    | Decimal?      | Troco para — só quando paga em dinheiro                |
| `status`       | `OrderStatus` | default `pending`                                      |
| `deliveryType` | String        | default `"delivery"` — `"delivery"` ou `"pickup"`      |
| `createdAt`    | DateTime      | default `now()`                                        |

### `OrderItem`

| Campo      | Tipo              | Regra                                                |
| ---------- | ----------------- | ---------------------------------------------------- |
| `id`       | Int               | PK                                                   |
| `orderId`  | Int               | FK → `Order` (`onDelete: Cascade`)                   |
| `crustId`  | Int?              | FK → `Crust` (borda opcional)                        |
| `size`     | String            | `"small"`, `"medium"` ou `"large"`                   |
| `quantity` | Int               | default `1`, mínimo `1`                              |
| `price`    | Decimal?          | **Preço unitário congelado** no momento do pedido    |
| `notes`    | String?           | Observações livres (ex: "sem cebola"), até 500 chars |
| `halves`   | `OrderItemHalf[]` | 1 metade (pizza inteira) ou 2 (meia a meia)          |

### `OrderItemHalf` e `OrderItemHalfIngredient`

| `OrderItemHalf` | Tipo | Regra                                  |
| --------------- | ---- | -------------------------------------- |
| `orderItemId`   | Int  | FK → `OrderItem` (`onDelete: Cascade`) |
| `pizzaId`       | Int  | FK → `Pizza`                           |
| `half`          | Int  | `1` ou `2` (qual metade)               |

`OrderItemHalfIngredient` é a tabela de **adicionais** de uma metade (PK composta
`orderItemHalfId` + `ingredientId`). São sempre **adição** — não existe mais o
conceito de "remover ingrediente" no modelo (ver regra de notas abaixo).

---

## Status do pedido (`OrderStatus`)

```
enum OrderStatus { pending | confirmed | preparing | delivering | delivered | cancelled }
```

| Status       | Significado              |
| ------------ | ------------------------ |
| `pending`    | Recebido, aguardando     |
| `confirmed`  | Confirmado pela pizzaria |
| `preparing`  | Em preparo               |
| `delivering` | Saiu para entrega        |
| `delivered`  | Entregue                 |
| `cancelled`  | Cancelado                |

Todo pedido nasce `pending`. A troca é feita por `PATCH /orders/:id/status`
(OPERATOR). **Não há máquina de estados** — qualquer transição é aceita desde que
o status seja um valor válido do enum.

---

## Cálculo do preço (regra central)

Todo o cálculo está em `OrdersService.createOrder`. Passo a passo:

### 1. Preço de cada metade

Para cada `OrderItemHalf`:

```
preçoDaMetade = preço da pizza no tamanho do item
              + Σ adicionais cobrados (ingredientes com preço, no tamanho do item)
```

- O preço da pizza vem do campo do tamanho (`priceSmall/Medium/Large`).
- Cada **adicional** soma o preço do `IngredientPrice` no mesmo tamanho.
- **Cobrança única:** o mesmo ingrediente repetido na metade é cobrado **uma vez**
  (controlado por um `Set` de ingredientes já cobrados).
- Pizza **inativa** → `400`. Pizza inexistente → `404`.

### 2. Preço da pizza (inteira ou meia a meia)

```
preçoDaPizza = max(preçoMetade1, preçoMetade2)
```

> 🍕 **Regra de meia a meia:** o cliente paga pela **metade mais cara**. Uma pizza
> inteira tem só uma metade, então o `max` devolve o preço dela mesma.

### 3. Borda

Se houver `crustId`: soma o preço da borda no tamanho do item. Borda inativa →
`400`; inexistente → `404`.

```
preçoUnitário = preçoDaPizza + preçoDaBorda
```

Esse `preçoUnitário` é **congelado** em `OrderItem.price` — assim "Repetir pedido"
e o histórico mostram o valor cobrado na época, mesmo que o catálogo mude depois.

### 4. Subtotal

```
subtotal = Σ (preçoUnitário do item × quantidade)
         + Σ (preço do produto × quantidade)
```

Produto inativo → `400`; inexistente → `404`.

### 5. Taxa de entrega e total

```
deliveryFee = (deliveryType === "delivery") ? Store.deliveryFee : 0
total       = subtotal + deliveryFee
```

A taxa vem do singleton `Store` (ver [store.md](./store.md)). Em `pickup` a taxa
é zero.

> ⚠️ **Preço ausente = grátis.** Se o tamanho pedido não tem preço cadastrado na
> pizza/borda/adicional, o cálculo usa `0`. Não há trava que impeça pedir um
> tamanho sem preço — risco anotado no `TODO.md`.

---

## Notas vs. remoção de ingredientes

A remoção de ingredientes **não é modelada no banco**. Para tirar algo da pizza,
o cliente escreve em `OrderItem.notes` (ex: "sem cebola"). Consequência de regra:

- **Adicionar** ingrediente → cobra (se tiver preço).
- **Remover** ingrediente → vira **nota** e **não altera** o valor.

---

## Troco (`changeFor`)

- Opcional no `CreateOrderDto` (`changeFor?`, número positivo).
- Persistido em `Order.changeFor` e exposto no retorno.
- Faz sentido apenas quando o pagamento é em dinheiro (`PaymentType.CASH`) — ver
  [payments.md](./payments.md). O backend **não** valida hoje a coerência entre
  `type === CASH` e a presença de `changeFor`.

---

## Tempo estimado de entrega (ETA)

Calculado em memória (não persistido) por `computeEta`, somando os tempos do
`Store`:

```
ETA (min) = basePrepMinutes
          + perPizzaMinutes × (total de pizzas no pedido)
          + (deliveryType === "delivery" ? deliveryMinutes : 0)
```

O total de pizzas considera a `quantity` de cada `OrderItem`. O resultado é
devolvido no campo extra **`estimatedDeliveryMinutes`** em todas as leituras de
pedido. Se não houver `Store` configurado, vem `null`.

---

## Avaliações (`Rating`)

Relação **1:1** com `Order` (`orderId` único).

| Campo     | Tipo    | Regra                                      |
| --------- | ------- | ------------------------------------------ |
| `orderId` | Int     | Único — FK → `Order` (`onDelete: Cascade`) |
| `stars`   | Int     | 1 a 5                                      |
| `comment` | String? | Comentário do cliente                      |
| `reply`   | String? | Resposta da pizzaria                       |

Regras:

- **Só pedidos entregues** podem ser avaliados (`status === delivered`), senão
  `400`. O cliente só avalia os próprios pedidos.
- A avaliação é um **upsert**: avaliar de novo o mesmo pedido sobrescreve a nota.
- A **resposta** (`reply`) é exclusiva do `OPERATOR` e exige uma avaliação
  existente (senão `404`).

---

## Endpoints

| Método  | Rota                       | Papel      | Descrição                                            |
| ------- | -------------------------- | ---------- | ---------------------------------------------------- |
| `POST`  | `/orders`                  | `CLIENT`   | Cria pedido — `clientId` vem do JWT, total calculado |
| `GET`   | `/orders/my`               | `CLIENT`   | Lista paginada dos pedidos do cliente autenticado    |
| `GET`   | `/orders/my/:id`           | `CLIENT`   | Detalha um pedido próprio                            |
| `POST`  | `/orders/:id/rating`       | `CLIENT`   | Avalia (upsert) um pedido próprio entregue           |
| `GET`   | `/orders`                  | `OPERATOR` | Lista paginada de todos os pedidos (recentes primeiro) |
| `GET`   | `/orders/:id`              | `OPERATOR` | Detalha qualquer pedido                              |
| `PATCH` | `/orders/:id/status`       | `OPERATOR` | Atualiza o status                                    |
| `PATCH` | `/orders/:id/rating/reply` | `OPERATOR` | Responde a avaliação de um pedido                    |

Todas as leituras incluem a árvore completa (`client`, `payment`, `rating`,
itens com metades/pizzas/ingredientes, produtos) e o campo
`estimatedDeliveryMinutes`.

### Paginação e filtros (`GET /orders` e `GET /orders/my`)

Ambas as listagens são paginadas e aceitam os mesmos filtros via query string:

| Param       | Tipo               | Padrão | Descrição                                              |
| ----------- | ------------------ | ------ | ------------------------------------------------------ |
| `page`      | inteiro ≥ 1        | `1`    | Página (offset = `(page - 1) * limit`)                 |
| `limit`     | inteiro 1–100      | `20`   | Itens por página                                       |
| `status`    | `OrderStatus`      | —      | Filtra por status do pedido                            |
| `startDate` | data/ISO 8601      | —      | `createdAt >= startDate`                               |
| `endDate`   | data/ISO 8601      | —      | `createdAt <= endDate` (inclui o dia inteiro se só data) |

`GET /orders` (OPERATOR) aceita também `clientId` (inteiro) para filtrar por
cliente. Em `GET /orders/my` o `clientId` é sempre o do JWT — qualquer valor
enviado é ignorado e o escopo permanece restrito ao cliente autenticado.

A resposta passa a ter o formato:

```jsonc
{
  "data": [ /* OrderDTO[] da página atual */ ],
  "meta": {
    "total": 137,
    "page": 1,
    "limit": 20,
    "totalPages": 7,
    "hasNext": true,
    "hasPrev": false
  }
}
```
