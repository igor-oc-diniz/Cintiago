# Home — Cardápio (`/`)

Vitrine pública do cardápio: pizzas e extras. Ponto de entrada do app.

[↩ Voltar ao README](../../README.md) · [Índice de páginas](./README.md)

| Item      | Valor                                    |
| --------- | ---------------------------------------- |
| Rota      | `/` (pública)                            |
| Entry     | `pages/Home/index.tsx`                   |
| Hook      | `pages/Home/useHomeData.ts`              |
| Layouts   | `Home.mobile.tsx` · `Home.desktop.tsx`   |
| Organisms | `PizzaList`, `ProductList`, `HomeBanner` |

## Dados

- `GET /pizzas` (`QUERY_KEYS.pizzas`) → adaptadas por `adaptPizza`.
- `GET /products` (`QUERY_KEYS.products`).
- Estado local `activeTab: "pizzas" | "extras"` controlado pelo `CategoryToggle`.

## Regras

- **Abas** Pizzas ↔ Extras substituíram os filtros antigos (Todas/Veganas/
  Tradicional).
- Clique em pizza → `/pizza/:id`.
- Adicionar extra → `addProduct` + toast `"<nome> adicionado ao carrinho"`.
- Cada lista trata `loading`, `error` e expõe `refetch`.

## Observações

- `adaptPizza` força `isVegetarian` e `isNew` como `false` (backend não fornece).
