import { useBreakpoint } from '@/hooks/useBreakpoint'

export function IngredientChip({ name, removed, onToggle }: {
  name: string
  removed: boolean
  onToggle: () => void
}) {
  const { isDesktop } = useBreakpoint()

  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: isDesktop ? '8px 13px' : '7px 12px',
        borderRadius: 'var(--radius-full)', cursor: 'pointer',
        background: removed ? 'var(--surface-inset)' : 'var(--surface)',
        boxShadow: removed ? 'inset 0 0 0 1px var(--border)' : 'inset 0 0 0 1px var(--border-strong)',
        border: 'none',
        fontFamily: 'var(--font-body)', fontWeight: 500,
        fontSize: isDesktop ? 13.5 : 13,
        color: removed ? 'var(--fg4)' : 'var(--fg2)',
        textDecoration: removed ? 'line-through' : 'none',
      }}
    >
      {removed
        ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--fg4)" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      }
      {name}
    </button>
  )
}
