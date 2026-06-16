# Seleção de pagamento (`/cart/payment`)

Escolha do método de pagamento e, quando dinheiro, o valor para troco.

[↩ Voltar ao README](../../README.md) · [Índice de páginas](./README.md)

| Item     | Valor                                        |
| -------- | -------------------------------------------- |
| Rota     | `/cart/payment` (pública)                    |
| Entry    | `pages/SelectPayment/index.tsx`              |
| Hook     | `pages/SelectPayment/usePaymentSelection.ts` |
| Template | `PaymentSelectionMobile`                     |
| Molecule | `SelectorRow`, `OptionCard`                  |

## Dados

- `GET /payments` (`QUERY_KEYS.payments`).
- Total exibido = `subtotal + fee` (fee só em delivery).

## Regras

- Seleção usa o **`type`** do pagamento, não o nome.
- **Troco:** input string local; valor numérico no `cartSlice` via
  `setChangeFor(parseTroco(value))` — `"R$ 12,50"` → `12.5`.
- Trocar o método **zera o troco** (lógica no slice) e limpa o input.
- Confirmar/voltar → `navigate(-1)`.

## Observações

- O campo de troco é relevante apenas para `CASH`; a UI do carrinho usa
  `isCash = paymentType === "CASH"`.
- Sem template desktop dedicado.
