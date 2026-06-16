# Mapeamento de componentes — Atomic Design

Inventário completo dos componentes em [`src/components/`](../src/components),
organizado pelos quatro níveis do Atomic Design. As regras de hierarquia
(quem pode importar quem) seguem as convenções do projeto.

[↩ Voltar ao README](../README.md)

```
atoms        → elementos indivisíveis (não importam de níveis acima)
molecules    → composições simples de atoms
organisms    → seções complexas (atoms + molecules)
templates    → layouts de página (sem dados reais; recebem props)
pages        → instâncias de templates com dados e lógica (ver Docs/pages)
```

---

## Atoms (16)

Elementos visuais indivisíveis. Não importam de molecules/organisms/pages.

| Componente           | Propósito                                                           | Props principais             |
| -------------------- | ------------------------------------------------------------------- | ---------------------------- |
| `Avatar`             | Foto do usuário com fallback de iniciais                            | `src`, `name`, `size`        |
| `Badge`              | Selo de status colorido (variantes de cor)                          | `variant`, `children`        |
| `Button`             | Botão base do design system (variantes, loading, `cursor-pointer`)  | variantes + estado disabled  |
| `CheckAnimation`     | Animação de "check" (confirmação de pedido)                         | —                            |
| `Divider`            | Linha divisória horizontal                                          | `className`, `style`         |
| `GoogleMark`         | Ícone "G" do Google para o botão de login                           | —                            |
| `IconTile`           | Quadrado com ícone e tom de cor (gold/terracotta/basil)             | `icon`, `tone`               |
| `Icons`              | Biblioteca de ícones próprios (Bike, Store, Clock, Flame, Receipt…) | `size`, `strokeWidth`        |
| `InfoTooltip`        | Tooltip de informação (ⓘ)                                           | `text`                       |
| `Input`              | Campo de texto base com estado de erro                              | `error`, `...inputProps`     |
| `OrderSeal`          | Selo com número do pedido                                           | `number`                     |
| `PizzaImageFallback` | Placeholder de imagem quando a pizza não tem `imageUrl`             | tamanho/variante             |
| `RadioDot`           | Indicador de seleção (bolinha de rádio)                             | `on`                         |
| `Spinner`            | Indicador de carregamento                                           | `size`                       |
| `Tag`                | Etiqueta clicável (filtros/categorias)                              | `label`, `active`, `onClick` |

> `atoms/Icons` exporta vários ícones nomeados (`BikeIcon`, `FlameIcon`,
> `ReceiptIcon`, `CircleCheckBigIcon`, etc.) consumidos pela timeline de
> tracking e pelos cards.

---

## Molecules (40)

Composições simples de atoms. Importam apenas de atoms.

### Cardápio & produto

| Componente         | Propósito                                                                         |
| ------------------ | --------------------------------------------------------------------------------- |
| `PizzaCard`        | Card de pizza na listagem (nome, descrição, preço, ação)                          |
| `ProductCard`      | Card de produto/extra na listagem                                                 |
| `PizzaSection`     | Seção agrupando pizzas                                                            |
| `CategoryToggle`   | Alternador Pizzas ↔ Extras (substituiu os filtros antigos)                        |
| `IngredientChip`   | Chip de ingrediente                                                               |
| `AddonRow`         | Linha de adicional selecionável (com preço)                                       |
| `SizeSelector`     | Seleção de tamanho (P/M/G) — **exporta** `SIZE_LABELS`, `SIZE_DESC`, `SIZE_ORDER` |
| `CrustSelector`    | Seleção de borda                                                                  |
| `NotesField`       | Campo de observações do item ("sem cebola")                                       |
| `QuantitySelector` | Stepper de quantidade (− valor +)                                                 |

### Carrinho & checkout

| Componente         | Propósito                                                        |
| ------------------ | ---------------------------------------------------------------- |
| `CartButton`       | Botão de carrinho com badge de contagem                          |
| `CartSummary`      | Resumo de valores do carrinho                                    |
| `PizzaCartCard`    | Item de pizza dentro do carrinho (com editar/remover/quantidade) |
| `ProductCartCard`  | Item de produto dentro do carrinho                               |
| `OrderMiniSummary` | Mini-resumo do pedido (usado em confirmação/tracking)            |
| `SumLine`          | Linha de soma (label + valor, com variante `strong`)             |
| `SelectorRow`      | Linha selecionável (entrega/pagamento)                           |
| `OptionCard`       | Card de opção selecionável (radio)                               |

### Pedidos & status

| Componente               | Propósito                                  |
| ------------------------ | ------------------------------------------ |
| `ActiveOrderCard`        | Card de pedido em andamento (mobile)       |
| `ActiveOrderCardDesktop` | Card de pedido em andamento (desktop)      |
| `PastOrderCard`          | Card de pedido concluído/cancelado         |
| `HTimeline`              | Timeline horizontal de progresso do pedido |
| `TimelineStep`           | Passo individual da timeline               |
| `Stepper`                | Indicador de etapas                        |
| `StarRating`             | Seleção de estrelas (avaliação)            |
| `RatingCard`             | Card de avaliação do pedido                |
| `OrderSeal` _(atom)_     | — (ver atoms)                              |

### Layout, navegação & estado

| Componente         | Propósito                                                     |
| ------------------ | ------------------------------------------------------------- |
| `PageHeader`       | Cabeçalho de página (título, eyebrow, voltar, slot à direita) |
| `CardHead`         | Cabeçalho de card (ícone + título + subtítulo)                |
| `BottomNavBar`     | Barra de navegação inferior (mobile)                          |
| `WebNav`           | Navegação superior (desktop)                                  |
| `ProfileShortcut`  | Atalho para o perfil                                          |
| `MetaRow`          | Linha de metadado (ícone + label + valor)                     |
| `InfoBlock`        | Bloco de informação (ícone, label, valor, sub)                |
| `EmptyState`       | Estado vazio (carrinho/lista vazios)                          |
| `StoreStatusBadge` | Badge "aberto/fechado" da loja                                |
| `StoreClosedModal` | Modal exibido ao tentar finalizar com a loja fechada          |
| `FormField`        | Campo de formulário (label + Input + erro)                    |
| `AddressForm`      | Formulário de endereço (CEP, rua, número…)                    |

---

## Organisms (7)

Seções complexas que combinam atoms e molecules.

| Componente    | Propósito                                                                |
| ------------- | ------------------------------------------------------------------------ |
| `Header`      | Cabeçalho global (logo, status da loja, carrinho) — `showBack`, `title`  |
| `Footer`      | Rodapé com info do estabelecimento (`useStoreInfo`)                      |
| `HomeBanner`  | Banner promocional da Home                                               |
| `PizzaList`   | Grade/lista de pizzas (loading/erro/refetch)                             |
| `ProductList` | Grade/lista de produtos                                                  |
| `HalfBlock`   | Bloco de customização de **uma metade** da pizza (ingredientes + addons) |
| `ProfileForm` | Formulário completo de perfil                                            |

---

## Templates (20)

Layouts de página sem dados reais — recebem tudo via props vindas dos hooks de
página. Há pares `*Mobile`/`*Desktop` para fluxos estruturalmente diferentes.

### Layouts base

| Componente   | Propósito                                       |
| ------------ | ----------------------------------------------- |
| `RootLayout` | Shell raiz (monta `useInitAuth`, `Outlet`)      |
| `AppLayout`  | Layout interno do app (header + conteúdo + nav) |
| `AuthLayout` | Layout das telas de auth (com `onClose`)        |

### Pares mobile / desktop

| Mobile                    | Desktop                | Página         |
| ------------------------- | ---------------------- | -------------- |
| `AuthGateMobile`          | `AuthGateDesktop`      | Login          |
| `DeliverySelectionMobile` | —                      | SelectDelivery |
| `PaymentSelectionMobile`  | —                      | SelectPayment  |
| `OrderConfirmMobile`      | —                      | OrderConfirm   |
| `OrderTrackingMobile`     | `OrderTrackingDesktop` | OrderTracking  |
| `OrderDetailMobile`       | `OrderDetailDesktop`   | OrderDetail    |
| `MyOrdersMobile`          | `MyOrdersDesktop`      | MyOrders       |
| —                         | `ProfileDesktop`       | Profile        |
| `OnboardingTemplate`      | (responsivo único)     | Onboarding     |

> SelectDelivery, SelectPayment e OrderConfirm hoje têm **apenas** template
> mobile; no desktop reutilizam o mesmo layout.

---

## Observações sobre reuso de labels

Alguns rótulos de domínio estão **duplicados** entre componentes e utils
(ex: `SIZE_LABELS` aparece em `molecules/SizeSelector`, `utils/cart.ts` e
`utils/format.ts`). A consolidação está pendente.
