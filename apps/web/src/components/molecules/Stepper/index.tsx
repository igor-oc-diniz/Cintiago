import { useBreakpoint } from '@/hooks/useBreakpoint'

type StepperSize = 'sm' | 'md' | 'lg'

export function Stepper({ value, onChange, min = 1, size }: {
  value: number
  onChange: (v: number) => void
  min?: number
  size?: StepperSize
}) {
  const { isDesktop } = useBreakpoint()
  const s = size ?? (isDesktop ? 'lg' : 'md')

  const dim = s === 'lg' ? 36 : s === 'md' ? 34 : 30
  const gap = s === 'lg' ? 16 : s === 'md' ? 14 : 10
  const fontSize = s === 'lg' ? 17 : s === 'md' ? 16 : 15
  const minWidth = s === 'lg' ? 20 : 16
  const iconSize = 17

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap }}>
      <button
        type="button"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        aria-label="Diminuir"
        style={{
          width: dim, height: dim, borderRadius: '50%',
          border: '1px solid var(--border-strong)', background: 'var(--surface)',
          cursor: 'pointer', display: 'grid', placeItems: 'center',
          opacity: value <= min ? 0.4 : 1, flexShrink: 0,
        }}
      >
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize, color: 'var(--fg1)', minWidth, textAlign: 'center' }}>
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label="Aumentar"
        style={{
          width: dim, height: dim, borderRadius: '50%',
          border: '1px solid var(--border-strong)', background: 'var(--surface)',
          cursor: 'pointer', display: 'grid', placeItems: 'center', flexShrink: 0,
        }}
      >
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  )
}
