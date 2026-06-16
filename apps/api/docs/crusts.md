# Bordas (`Crust`)

Borda opcional de um item de pizza (ex: catupiry, cheddar). Tem preço próprio por
tamanho, somado ao preço da pizza quando escolhida. Cada `OrderItem` referencia
**no máximo uma** borda.

[↩ Voltar ao README](../README.md)

---

## Modelo `Crust`

| Campo         | Tipo          | Regra                               |
| ------------- | ------------- | ----------------------------------- |
| `id`          | Int           | PK                                  |
| `name`        | String        | Nome da borda                       |
| `description` | String?       | Opcional                            |
| `priceSmall`  | Decimal?      | Preço no tamanho P                  |
| `priceMedium` | Decimal?      | Preço no tamanho M                  |
| `priceLarge`  | Decimal?      | Preço no tamanho G                  |
| `active`      | Boolean       | default `true` — controla a vitrine |
| `orderItems`  | `OrderItem[]` | Itens de pedido que usam esta borda |

> Diferente de `Pizza`/`Ingredient`, `Crust.name` **não é único** no schema.

---

## Regras de negócio

- **Borda é opcional por item.** O `OrderItem.crustId` é nullable; sem borda,
  nenhum custo de borda é somado.
- **Preço por tamanho.** A borda é cobrada conforme o tamanho do item
  (`priceSmall/Medium/Large`). Tamanho sem preço cadastrado = **R$ 0,00**.
- **`active` controla a vitrine.** `GET /crusts` retorna apenas bordas ativas.
  - No pedido, uma borda inativa é **rejeitada** (`400 Bad Request`).
- **Soma ao item.** O preço da borda entra no `price` unitário do `OrderItem`,
  junto com o preço da pizza (ver [orders.md](./orders.md)).

---

## Endpoints

| Método   | Rota           | Papel      | Descrição                                   |
| -------- | -------------- | ---------- | ------------------------------------------- |
| `GET`    | `/crusts`      | público    | Lista bordas **ativas**                     |
| `GET`    | `/crusts/:id`  | público    | Busca por id                                |
| `POST`   | `/crusts`      | `OPERATOR` | Cria uma borda                              |
| `POST`   | `/crusts/bulk` | `OPERATOR` | Cria várias bordas (array) via `createMany` |
| `PATCH`  | `/crusts/:id`  | `OPERATOR` | Atualiza (inclui `active`)                  |
| `DELETE` | `/crusts/:id`  | `OPERATOR` | Remove definitivamente                      |
