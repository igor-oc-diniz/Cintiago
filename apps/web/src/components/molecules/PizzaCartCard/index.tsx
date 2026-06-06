import { useBreakpoint } from '@/hooks/useBreakpoint'
import type { CartPizzaItem } from '@/store/slices/cartSlice'
import { pizzaItemLabel, pizzaItemSub, pizzaItemCustomizations } from '@/utils/cart'
import { Stepper } from '@/components/molecules/Stepper'

const chipBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', background: 'var(--surface)',
  cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--fg2)',
}

export function PizzaCartCard({ item, onQty, onRemove, onEdit }: {
  item: CartPizzaItem
  onQty: (v: number) => void
  onRemove: () => void
  onEdit: () => void
}) {
  const { isDesktop } = useBreakpoint()
  const customs = pizzaItemCustomizations(item)

  const imgSize = isDesktop ? 88 : 64
  const padding = isDesktop ? 16 : 12
  const gap = isDesktop ? 16 : 13
  const titleSize = isDesktop ? 20 : 17
  const subSize = isDesktop ? 13.5 : 12.5
  const customSize = isDesktop ? 13 : 12
  const priceSize = isDesktop ? 19 : 16
  const dividerMargin = isDesktop ? '14px 0 12px' : '11px 0 10px'
  const chipHeight = isDesktop ? 36 : 34
  const chipFontSize = isDesktop ? 13 : 12.5
  const chipPadding = isDesktop ? '0 14px' : '0 13px'

  return (
    <div className="cg-card cg-grain" style={{ padding, position: 'relative' }}>
      <div style={{ display: 'flex', gap }}>
        <div style={{
          width: imgSize, height: imgSize, flexShrink: 0,
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
          background: 'radial-gradient(60% 60% at 38% 32%, #C97A45 0%, #9A4A22 55%, #5E2A12 100%)',
        }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: titleSize, color: 'var(--fg1)', lineHeight: 1.15 }}>
            {pizzaItemLabel(item)}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: subSize, color: 'var(--fg3)', marginTop: isDesktop ? 4 : 3 }}>
            {pizzaItemSub(item)}
          </div>
          {customs.length > 0 && (
            <div style={{ fontFamily: 'var(--font-body)', fontSize: customSize, color: 'var(--fg4)', marginTop: isDesktop ? 5 : 4, lineHeight: isDesktop ? 1.45 : 1.4 }}>
              {customs.join(' · ')}
            </div>
          )}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: priceSize, color: 'var(--fg1)', flexShrink: 0, whiteSpace: 'nowrap' }}>
          {(item.unitPrice * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </div>
      </div>
      <hr className="cg-divider" style={{ margin: dividerMargin }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: isDesktop ? 8 : 6 }}>
          <button type="button" onClick={onEdit} style={{ ...chipBtn, height: chipHeight, padding: chipPadding, fontSize: chipFontSize }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--fg3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Editar
          </button>
          <button type="button" onClick={onRemove} style={{ ...chipBtn, height: chipHeight, padding: chipPadding, fontSize: chipFontSize }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--fg3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
            Remover
          </button>
        </div>
        <Stepper value={item.quantity} onChange={onQty} size={isDesktop ? 'md' : 'sm'} />
      </div>
    </div>
  )
}
