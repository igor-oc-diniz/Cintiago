# Produtos (`Product`)

Itens avulsos do cardápio que **não são pizzas** — bebidas, sobremesas, etc.
Têm preço único (sem variação por tamanho) e entram no pedido pela relação
`OrderProduct`.

[↩ Voltar ao README](../README.md)

---

## Modelo `Product`

| Campo           | Tipo             | Regra                               |
| --------------- | ---------------- | ----------------------------------- |
| `id`            | Int              | PK                                  |
| `name`          | String           | Nome do produto                     |
| `description`   | String?          | Opcional                            |
| `price`         | Decimal          | **Obrigatório** (preço único)       |
| `active`        | Boolean          | default `true` — controla a vitrine |
| `createdAt`     | DateTime         | default `now()`                     |
| `orderProducts` | `OrderProduct[]` | Ocorrências em pedidos              |

### `OrderProduct` (item de pedido)

| Campo       | Tipo | Regra                              |
| ----------- | ---- | ---------------------------------- |
| `orderId`   | Int  | FK → `Order` (`onDelete: Cascade`) |
| `productId` | Int  | FK → `Product`                     |
| `quantity`  | Int  | default `1`, mínimo `1`            |

---

## Regras de negócio

- **Preço único.** Ao contrário de pizzas/bordas, produto não tem preço por
  tamanho — `price` é obrigatório na criação.
- **`active` controla a vitrine.** `GET /products` retorna apenas produtos ativos.
  - No pedido, um produto inativo é **rejeitado** (`400 Bad Request`).
- **Subtotal no pedido.** Cada produto soma `price × quantity` ao subtotal do
  pedido (ver [orders.md](./orders.md)).

---

## Endpoints

| Método   | Rota             | Papel      | Descrição                                     |
| -------- | ---------------- | ---------- | --------------------------------------------- |
| `GET`    | `/products`      | público    | Lista produtos **ativos**                     |
| `GET`    | `/products/:id`  | público    | Busca por id                                  |
| `POST`   | `/products`      | `OPERATOR` | Cria um produto                               |
| `POST`   | `/products/bulk` | `OPERATOR` | Cria vários produtos (array) via `createMany` |
| `PATCH`  | `/products/:id`  | `OPERATOR` | Atualiza (inclui `active`)                    |
| `DELETE` | `/products/:id`  | `OPERATOR` | Remove definitivamente                        |
