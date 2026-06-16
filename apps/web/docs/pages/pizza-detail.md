# Detalhe da pizza / Montagem (`/pizza/:id`)

Montagem da pizza: tamanho, borda, meia-a-meia, adicionais por metade,
observações e quantidade. Também serve como tela de **edição** de um item já no
carrinho.

[↩ Voltar ao README](../../README.md) · [Índice de páginas](./README.md)

| Item      | Valor                                                                         |
| --------- | ----------------------------------------------------------------------------- |
| Rota      | `/pizza/:id` (pública)                                                        |
| Entry     | `pages/PizzaDetail/index.tsx`                                                 |
| Hook      | `pages/PizzaDetail/usePizzaDetailData.ts`                                     |
| Layouts   | `PizzaDetail.mobile.tsx` · `PizzaDetail.desktop.tsx`                          |
| Organisms | `HalfBlock` (customização de cada metade)                                     |
| Molecules | `SizeSelector`, `CrustSelector`, `AddonRow`, `NotesField`, `QuantitySelector` |

## Dados

- `GET /pizzas/:id`, `GET /pizzas` (segunda metade), `GET /crusts`,
  `GET /ingredients`.

## Regras (cálculo de preço)

Algoritmo idêntico ao backend (ver [regras de negócio §1](../business-rules.md)):

- preço por tamanho; meia-a-meia cobra o **maior** das metades;
- adicionais deduplicados cross-half via `Set`;
- ingredientes default são grátis; só adicionais (preço > 0) contam;
- `unitPrice = pizzaPrice + crustPrice`; `total = unitPrice × qty`.

## Modo edição

Ativado quando há `location.state.item` (`isEditMode`):

- estados iniciais pré-preenchidos a partir do item;
- botão exibe "Atualizar" (`confirmLabel`);
- confirma com `updatePizzaItem` e volta com `navigate(-1)`.

No modo adição, confirma com `addPizza` e vai para `/cart`.

## Observações

- O estado de loading do `index.tsx` usa **estilos inline** (`style={{}}`),
  divergindo da regra de tokens/classes.
