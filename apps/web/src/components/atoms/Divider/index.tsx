import { cn } from '@/utils/cn'

interface DividerProps {
  className?: string
}

export function Divider({ className }: DividerProps) {
  const isBamboo = className?.includes('bamboo')

  if (isBamboo) {
    return (
      <div
        className={cn(
          'h-6 bg-[var(--color-surface-high)] border-y border-[var(--color-bamboo-accent)]',
          className,
        )}
        style={{ backgroundImage: 'var(--texture-bamboo-slats)' }}
      />
    )
  }

  return (
    <hr
      className={cn('border-0 border-t border-[var(--color-outline-variant)]', className)}
    />
  )
}
