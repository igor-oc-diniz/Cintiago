import { ArrowRight } from 'lucide-react'
import { formatPrice } from '@/utils/format'
import type { PizzaCardProps } from './types'

function MenuBadge({ isVegetarian, isNew }: { isVegetarian?: boolean; isNew?: boolean }) {
  if (!isVegetarian && !isNew) return null
  const veggie = isVegetarian && !isNew
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 9px 3px 7px', borderRadius: 999,
      background: veggie ? 'var(--success-soft)' : 'var(--accent-soft)',
      color: veggie ? 'var(--basil-700)' : 'var(--gold-800)',
      fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11, letterSpacing: '0.01em',
    }}>
      {veggie ? 'Veggie' : 'Novo'}
    </span>
  )
}

function PizzaImage({ imageUrl, name }: { imageUrl: string | null; name: string }) {
  if (imageUrl) {
    return <img src={imageUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  }
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'radial-gradient(60% 60% at 38% 32%, #C97A45 0%, #9A4A22 55%, #5E2A12 100%)',
      position: 'relative',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(70% 60% at 30% 24%, rgba(255,246,230,0.32), transparent 60%)' }} />
      <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 -18px 32px rgba(60,30,12,0.28)' }} />
    </div>
  )
}

export function PizzaCard({
  name,
  description,
  imageUrl,
  startingPrice,
  isVegetarian,
  isNew,
  onClick,
  variant = 'horizontal',
}: PizzaCardProps) {
  if (variant === 'vertical') {
    return (
      <button
        type="button"
        onClick={onClick}
        className="cg-card cg-grain web-lift"
        style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', cursor: 'pointer', border: 'none', font: 'inherit', padding: 0, width: '100%' }}
      >
        <div style={{ position: 'relative', height: 184, overflow: 'hidden' }}>
          <PizzaImage imageUrl={imageUrl} name={name} />
          {(isVegetarian || isNew) && (
            <div style={{ position: 'absolute', top: 12, left: 12 }}>
              <MenuBadge isVegetarian={isVegetarian} isNew={isNew} />
            </div>
          )}
        </div>
        <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--fg1)', lineHeight: 1.1, marginBottom: 5 }}>{name}</div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, lineHeight: 1.5, color: 'var(--fg3)', margin: 0 }}>{description}</p>
          <div style={{ marginTop: 'auto', paddingTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'var(--fg4)' }}>
              a partir de{' '}
              <strong style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--fg1)', marginLeft: 2 }}>
                {formatPrice(startingPrice)}
              </strong>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13.5 }}>
              Montar <ArrowRight size={16} strokeWidth={2.2} />
            </span>
          </div>
        </div>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="cg-card cg-grain"
      style={{
        display: 'flex', gap: 14, padding: 12, width: '100%',
        textAlign: 'left', cursor: 'pointer', border: 'none',
        alignItems: 'stretch', background: 'none',
      }}
    >
      <div style={{
        width: 96, height: 96, flexShrink: 0,
        borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        background: 'var(--oat)',
      }}>
        <PizzaImage imageUrl={imageUrl} name={name} />
      </div>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--fg1)', lineHeight: 1.1 }}>
            {name}
          </span>
          <MenuBadge isVegetarian={isVegetarian} isNew={isNew} />
        </div>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.45, color: 'var(--fg3)', textWrap: 'pretty' } as React.CSSProperties}>
          {description}
        </span>
        <span style={{ marginTop: 'auto', paddingTop: 8, fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'var(--fg4)' }}>
          a partir de{' '}
          <strong style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--fg1)', marginLeft: 2 }}>
            {formatPrice(startingPrice)}
          </strong>
        </span>
      </div>
    </button>
  )
}
