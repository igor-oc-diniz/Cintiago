# Ingredientes & Preços (`Ingredient` + `IngredientPrice`)

Os ingredientes têm dois papéis no sistema:

1. **Compor a receita base** de uma pizza (`PizzaIngredient`, sem custo extra);
2. **Ser adicionados** a uma metade no pedido — e aí, se tiverem preço cadastrado,
   são **cobrados como adicional**.

O preço fica em uma tabela separada (`IngredientPrice`), relação **1:1** com o
ingrediente.

[↩ Voltar ao README](../README.md)

---

## Modelo `Ingredient`

| Campo              | Tipo                        | Regra                              |
| ------------------ | --------------------------- | ---------------------------------- |
| `id`               | Int                         | PK                                 |
| `name`             | String                      | **Único**                          |
| `category`         | String?                     | Opcional (ex: "queijos", "carnes") |
| `createdAt`        | DateTime                    | default `now()`                    |
| `ingredientPrice`  | `IngredientPrice?`          | Preço (1:1, opcional)              |
| `pizzaIngredients` | `PizzaIngredient[]`         | Receitas base onde aparece         |
| `halfIngredients`  | `OrderItemHalfIngredient[]` | Adições feitas em pedidos          |

## Modelo `IngredientPrice`

A PK **é** o `ingredientId` (relação 1:1, `onDelete: Cascade`):

| Campo          | Tipo     | Regra                  |
| -------------- | -------- | ---------------------- |
| `ingredientId` | Int      | PK + FK → `Ingredient` |
| `priceSmall`   | Decimal? | Adicional no tamanho P |
| `priceMedium`  | Decimal? | Adicional no tamanho M |
| `priceLarge`   | Decimal? | Adicional no tamanho G |

---

## Regras de negócio

- **Ingrediente sem preço = adicional grátis.** Se o `IngredientPrice` não existe
  (ou tem `null` no tamanho pedido), a adição **não soma nada** ao total. Só
  ingredientes com preço cadastrado são cobrados.
- **Preço por tamanho.** O adicional cobrado depende do tamanho da pizza
  (`priceSmall/Medium/Large`), igual às pizzas e bordas.
- **Cobrança única por metade.** Se o mesmo ingrediente for adicionado mais de uma
  vez na mesma metade, é cobrado **uma vez só** (ver `chargedIngredients` em
  [orders.md](./orders.md)).
- **Nome único.** Ingredientes duplicados caem em `409 Conflict`.
- **Cascade no preço.** Apagar o ingrediente apaga o preço junto.

---

## Endpoints — `ingredients`

| Método   | Rota                | Papel      | Descrição                            |
| -------- | ------------------- | ---------- | ------------------------------------ |
| `GET`    | `/ingredients`      | público    | Lista todos (com `ingredientPrice`)  |
| `GET`    | `/ingredients/:id`  | público    | Busca por id                         |
| `POST`   | `/ingredients`      | `OPERATOR` | Cria um ingrediente (sem preço)      |
| `POST`   | `/ingredients/bulk` | `OPERATOR` | Cria vários (array) via `createMany` |
| `PATCH`  | `/ingredients/:id`  | `OPERATOR` | Atualiza `name`/`category`           |
| `DELETE` | `/ingredients/:id`  | `OPERATOR` | Remove (cascateia o preço)           |

## Endpoints — `ingredient-prices`

Todos exigem `OPERATOR`. A chave de rota é o **`ingredientId`**, não um id próprio.

| Método   | Rota                                      | Descrição                                                     |
| -------- | ----------------------------------------- | ------------------------------------------------------------- |
| `GET`    | `/ingredient-prices`                      | Lista todos os preços                                         |
| `GET`    | `/ingredient-prices/:ingredientId`        | Preço de um ingrediente                                       |
| `POST`   | `/ingredient-prices`                      | **Upsert** de um preço (cria ou atualiza pelo `ingredientId`) |
| `POST`   | `/ingredient-prices/bulk`                 | Upsert de vários preços (array)                               |
| `POST`   | `/ingredient-prices/with-ingredient`      | Cria **ingrediente + preço** numa transação                   |
| `POST`   | `/ingredient-prices/with-ingredient/bulk` | Cria vários ingredientes com preço                            |
| `PATCH`  | `/ingredient-prices/:ingredientId`        | Atualiza só os preços                                         |
| `DELETE` | `/ingredient-prices/:ingredientId`        | Remove o preço (mantém o ingrediente)                         |

### `POST` upsert vs. `with-ingredient`

- **`POST /ingredient-prices`** assume que o ingrediente **já existe** e faz
  `upsert` do preço pelo `ingredientId`.
- **`POST /ingredient-prices/with-ingredient`** cria o ingrediente **e** o preço
  juntos, dentro de uma `$transaction` (ou ambos entram, ou nenhum).
