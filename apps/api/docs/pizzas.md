# Pizzas (`Pizza`)

O catálogo de sabores. Cada pizza tem **três faixas de preço** (uma por tamanho)
e uma receita de ingredientes "de fábrica" (`PizzaIngredient`). É a entidade
central que o cliente escolhe ao montar um pedido.

[↩ Voltar ao README](../README.md)

---

## Modelo `Pizza`

| Campo              | Tipo                | Regra                                     |
| ------------------ | ------------------- | ----------------------------------------- |
| `id`               | Int                 | PK                                        |
| `name`             | String              | **Único**                                 |
| `description`      | String?             | Opcional                                  |
| `priceSmall`       | Decimal?            | Preço tamanho P                           |
| `priceMedium`      | Decimal?            | Preço tamanho M                           |
| `priceLarge`       | Decimal?            | Preço tamanho G                           |
| `active`           | Boolean             | default `true` — controla a vitrine       |
| `createdAt`        | DateTime            | default `now()`                           |
| `pizzaIngredients` | `PizzaIngredient[]` | Receita base (ingredientes que a compõem) |
| `orderItemHalves`  | `OrderItemHalf[]`   | Metades de pedido que usam esta pizza     |

### `PizzaIngredient` (receita base)

Tabela de junção entre `Pizza` e `Ingredient`, com PK composta
(`pizzaId`, `ingredientId`):

| Campo          | Tipo    | Regra                                  |
| -------------- | ------- | -------------------------------------- |
| `pizzaId`      | Int     | FK → `Pizza` (`onDelete: Cascade`)     |
| `ingredientId` | Int     | FK → `Ingredient`                      |
| `quantity`     | String? | Quantidade descritiva (ex: "2 fatias") |

> A receita base é **informativa** (mostra do que a pizza é feita). Ela **não**
> entra no cálculo de preço — só ingredientes adicionados no pedido são cobrados.
> Ver [orders.md](./orders.md) e [ingredients.md](./ingredients.md).

---

## Regras de negócio

- **Preço por tamanho.** Cada tamanho (`small`/`medium`/`large`) tem seu próprio
  campo. Os três são **opcionais** — uma pizza pode existir sem preço para algum
  tamanho.
  - ⚠️ **Atenção:** se um tamanho está com preço `null` e mesmo assim é pedido, o
    cálculo do pedido trata como **R$ 0,00** (não bloqueia). Risco anotado no
    `TODO.md`.
- **`active` controla a vitrine.** O `GET /pizzas` público retorna **apenas
  pizzas ativas** (`active: true`). Desativar é o "soft delete" do catálogo.
  - No pedido, uma pizza inativa é **rejeitada** (`400 Bad Request`).
- **Nome único.** Criar/renomear para um nome existente cai em `409 Conflict`.
- **Meia a meia.** Uma pizza pode ocupar metade de um item de pedido; o preço da
  pizza inteira é o **maior** entre as duas metades (ver [orders.md](./orders.md)).

---

## Endpoints

| Método   | Rota           | Papel      | Descrição                                    |
| -------- | -------------- | ---------- | -------------------------------------------- |
| `GET`    | `/pizzas`      | público    | Lista pizzas **ativas** (com a receita base) |
| `GET`    | `/pizzas/:id`  | público    | Busca por id (com a receita base)            |
| `POST`   | `/pizzas`      | `OPERATOR` | Cria uma pizza                               |
| `POST`   | `/pizzas/bulk` | `OPERATOR` | Cria várias pizzas (array) via `createMany`  |
| `PATCH`  | `/pizzas/:id`  | `OPERATOR` | Atualiza (inclui `active`)                   |
| `DELETE` | `/pizzas/:id`  | `OPERATOR` | Remove definitivamente                       |

> `GET /pizzas` e `GET /pizzas/:id` incluem `pizzaIngredients` com o ingrediente
> aninhado. Os endpoints públicos **não** listam pizzas inativas — para vê-las é
> preciso buscar pelo id direto (operador).
