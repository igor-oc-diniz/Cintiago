import { useBreakpoint } from '@/hooks/useBreakpoint'

export function PizzaSection({ title, required, note, children }: {
  title: string
  required?: boolean
  note?: string
  children: React.ReactNode
}) {
  const { isDesktop } = useBreakpoint()

  if (isDesktop) {
    return (
      <section style={{ paddingBottom: 26 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, color: 'var(--fg1)', margin: 0, whiteSpace: 'nowrap' }}>
            {title}
          </h3>
          {required && (
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11, color: 'var(--primary)', letterSpacing: '0.04em', textTransform: 'uppercase', background: 'var(--primary-soft)', padding: '2px 8px', borderRadius: 999 }}>
              obrigatório
            </span>
          )}
          {note && (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'var(--fg4)', marginLeft: 'auto' }}>
              {note}
            </span>
          )}
        </div>
        {children}
      </section>
    )
  }

  return (
    <div style={{ padding: '0 16px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 9, marginBottom: 11 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 19, color: 'var(--fg1)', margin: 0 }}>
          {title}
        </h3>
        {required && (
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 10.5, color: 'var(--primary)', letterSpacing: '0.04em', textTransform: 'uppercase', background: 'var(--primary-soft)', padding: '2px 8px', borderRadius: 999 }}>
            obrigatório
          </span>
        )}
        {note && (
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--fg4)', marginLeft: 'auto' }}>
            {note}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}
