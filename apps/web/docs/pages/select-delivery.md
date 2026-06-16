# Seleção de entrega (`/cart/delivery`)

Escolha entre **delivery** e **retirada no local**, com endereço e ETA.

[↩ Voltar ao README](../../README.md) · [Índice de páginas](./README.md)

| Item     | Valor                                          |
| -------- | ---------------------------------------------- |
| Rota     | `/cart/delivery` (pública)                     |
| Entry    | `pages/SelectDelivery/index.tsx`               |
| Hook     | `pages/SelectDelivery/useDeliverySelection.ts` |
| Template | `DeliverySelectionMobile`                      |
| Molecule | `AddressForm`, `OptionCard`                    |

## Dados / estado

- `deliveryFee`, `addressLines`, `computeEtaMinutes` de `useStoreInfo`.
- Endereço inicial: `ADDRESS_DEFAULT` (`constants/delivery.ts`), editável.
- `sel: "delivery" | "pickup"` (inicia conforme `cart.deliveryType`).

## Regras

- **ETA** calculado por `computeEtaMinutes(pizzaCount, tipo)` — soma
  `deliveryMinutes` só em delivery (ver [regras §7](../business-rules.md)).
- Selecionar `pickup` desativa a edição de endereço.
- Confirmar → `setDelivery(sel)` e `navigate(-1)` (volta ao carrinho).

## Observações

- `dine_in` existe no slice mas **não** é oferecido aqui (`DeliveryOption` só
  tem delivery/pickup) — caminho morto.
- Sem template desktop dedicado.
