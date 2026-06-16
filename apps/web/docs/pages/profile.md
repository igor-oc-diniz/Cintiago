# Perfil (`/profile`)

Consulta e edição do cadastro do cliente; acesso a pedidos e logout.

[↩ Voltar ao README](../../README.md) · [Índice de páginas](./README.md)

| Item     | Valor                                       |
| -------- | ------------------------------------------- |
| Rota     | `/profile` (login + perfil completo)        |
| Entry    | `pages/Profile/index.tsx`                   |
| Hook     | `hooks/useProfile.ts`                       |
| Template | `ProfileDesktop` (+ organism `ProfileForm`) |

## Dados

- `GET /clients/me` (`QUERY_KEYS.myProfile`).
- Formulário local hidratado a partir do perfil; flag `dirty`.

## Regras

- **Autopreenchimento por CEP** (ViaCEP) ao completar 8 dígitos.
- **Salvar:** `PATCH /clients/me`; invalida `QUERY_KEYS.myProfile` e zera `dirty`.
- **Logout:** modal de confirmação → `useAuth().logout` → `/`.
- `handleContact` (telefone da loja) e `handleGoOrders` (`/orders`).

## Observações

- `fetchAddressByCep` reimplementado aqui em vez de reusar `utils/cep.ts`
  (duplicação).
