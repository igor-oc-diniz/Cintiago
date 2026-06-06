import { useBreakpoint } from '@/hooks/useBreakpoint'
import type { CartProductItem } from '@/store/slices/cartSlice'
import { Stepper } from '@/components/molecules/Stepper'

export function ProductCartCard({ item, onQty }: {
  item: CartProductItem
  onQty: (v: number) => void
}) {
  const { isDesktop } = useBreakpoint()

  const imgSize = isDesktop ? 72 : 54
  const padding = isDesktop ? 16 : 12
  const gap = isDesktop ? 16 : 13
  const nameSize = isDesktop ? 19 : 16
  const subSize = isDesktop ? 13 : undefined
  const priceSize = isDesktop ? 18 : 14

  return (
    <div className="cg-card cg-grain" style={{ display: 'flex', gap, padding, alignItems: 'center' }}>
      <div style={{
        width: imgSize, height: imgSize, flexShrink: 0,
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(150deg, #DCE6DB 0%, #A9C0A6 100%)',
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: nameSize, color: 'var(--fg1)' }}>
          {item.productName}
        </div>
        {isDesktop && (
          <div style={{ fontFamily: 'var(--font-body)', fontSize: subSize, color: 'var(--fg3)', marginTop: 2 }}>
            {item.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} cada
          </div>
        )}
        {!isDesktop && (
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: priceSize, color: 'var(--fg1)', marginTop: 3 }}>
            {(item.unitPrice * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
        )}
      </div>
      <Stepper value={item.quantity} onChange={onQty} size={isDesktop ? 'md' : 'sm'} />
      {isDesktop && (
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: priceSize, color: 'var(--fg1)', minWidth: 88, textAlign: 'right' }}>
          {(item.unitPrice * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </div>
      )}
    </div>
  )
}
