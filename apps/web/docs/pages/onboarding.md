# Onboarding (`/onboarding`)

Completa o cadastro do cliente (telefone + endereço) após o primeiro login.

[↩ Voltar ao README](../../README.md) · [Índice de páginas](./README.md)

| Item     | Valor                                         |
| -------- | --------------------------------------------- |
| Rota     | `/onboarding` (login, perfil **não** exigido) |
| Entry    | `pages/Onboarding/index.tsx`                  |
| Hook     | `pages/Onboarding/useOnboardingForm.ts`       |
| Template | `OnboardingTemplate`                          |
| Molecule | `AddressForm`, `FormField`                    |

## Quando aparece

`AuthGuard requireProfile={false}` + redirecionamento quando
`user.clientId === null`.

## Regras

- **Máscaras:** telefone `(11) 99999-9999` e CEP `00000-000` na digitação.
- **Autopreenchimento por CEP:** ao completar 8 dígitos, busca no ViaCEP e
  preenche rua/bairro/cidade.
- **Validação local:** telefone ≥ 10 dígitos; CEP, rua, número, bairro e cidade
  obrigatórios.
- **Submit:** `POST /clients/me` (sem `userId` — vem do JWT). Em sucesso, refaz
  `GET /auth/me` para atualizar o `clientId` e navega para `from` ou `/cart`.

## Observações

- Busca por CEP reimplementada aqui em vez de reusar `utils/cep.ts` (duplicação).
- Fallback de nome `"você"` quando o usuário não tem nome.
