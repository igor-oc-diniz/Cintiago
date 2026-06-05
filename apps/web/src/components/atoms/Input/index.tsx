import { cn } from '@/utils/cn'
import type { InputProps } from './types'

export function Input({ error, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      <input
        className={cn(
          'w-full px-4 py-3 rounded bg-[var(--color-surface-high)] border border-transparent font-body text-[var(--color-on-surface)] transition-colors',
          'focus:outline-none focus:border-[var(--color-primary)] focus:bg-[var(--color-surface-lowest)]',
          error && 'border-[var(--color-error)]',
          className,
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-[var(--color-error)]">{error}</p>
      )}
    </div>
  )
}
